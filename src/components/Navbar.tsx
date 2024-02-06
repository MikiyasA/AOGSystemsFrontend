import React from "react";
import {
  Image,
  Grid,
  Group,
  Button,
  ActionIcon,
  useMantineColorScheme,
  useComputedColorScheme,
  useMantineTheme,
  Switch,
  Divider,
  rem,
  Menu,
} from "@mantine/core";
import Link from "next/link";
import cx from "clsx";
import classes from "../styles/Navbar.module.css";
import { modals } from "@mantine/modals";
import Login from "@/pages/login";
import {
  IconCaretRightFilled,
  IconDirectionArrows,
  IconMoon,
  IconMoonStars,
  IconSun,
} from "@tabler/icons-react";
import { getSession, signOut, useSession } from "next-auth/react";
import UserActionMenu from "./User/UserActionMenu";

const links = [
  { link: "/", label: "Home" },
  { link: "/assignment", label: "Assignment" },
  { link: "/corefollowup", label: "Core Followup" },
  {
    // link: "/part",
    label: "Part",
    subLinks: [
      { link: "/part/add_part", label: "Add Part" },
      { link: "/part/search", label: "Part Search" },
      { link: "/part/search", label: "Part Search" },
    ],
  },
  {
    // link: "/company",
    label: "Company",
    subLinks: [
      { link: "/company/add_company", label: "Add Company" },
      { link: "/company/search", label: "Company Search" },
    ],
  },
  { link: "/sales", label: "Sales" },
  { link: "/loan", label: "Loan" },
  {
    link: "/invoice",
    label: "Invoice",
    subLinks: [{ link: "/invoice/search", label: "Invoice Search" }],
  },
  { link: "/admin", label: "Admin" },
];

const Navbar = () => {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

  const session = useSession();
  session.status === "authenticated" && modals.closeAll();

  const items = links.map((link) => (
    <Link
      key={link.label}
      href={link.link ? link.link : ""}
      className={classes.link}
    >
      {link.label}
      {link.subLinks && (
        <Menu width="auto" shadow="md">
          <Menu.Target>
            <IconCaretRightFilled size={17} />
          </Menu.Target>
          <Menu.Dropdown>
            {link.subLinks.map((sl: any, i: any) => (
              <Menu.Item key={i}>
                <Link href={sl.link} className={classes.link}>
                  {sl.label}
                </Link>
              </Menu.Item>
            ))}
          </Menu.Dropdown>
        </Menu>
      )}
    </Link>
  ));

  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  const isLight = computedColorScheme === "light";

  return (
    <Grid w={"100%"} m={"20px 20px 0px 20px"} align="center">
      <Grid.Col span="auto">
        <Image
          alt="Logo"
          radius="md"
          // h={200}
          w="15pc"
          fit="contain"
          src={"/et-logo.jpg"}
        />
      </Grid.Col>

      <Grid.Col span={7} style={{ textAlign: "center" }}>
        <Group ml={50} gap={15} className={classes.linksGroup} visibleFrom="sm">
          {items}
        </Group>
      </Grid.Col>
      <Grid.Col span="auto" style={{ textAlign: "end" }}>
        {!session.data ? (
          <Group
            style={{
              right: "10px",
            }}
          >
            <Button
              onClick={() => {
                modals.open({
                  title: "Log In",
                  children: <Login />,
                });
              }}
            >
              Log In
            </Button>
            <ActionIcon
              onClick={() => setColorScheme(isLight ? "dark" : "light")}
              variant="default"
              size={"xl"}
              aria-label="Toggle color scheme"
            >
              <IconMoon
                style={isLight ? { display: "block" } : { display: "none" }}
                stroke={1.5}
              />
              <IconSun
                style={isLight ? { display: "none" } : { display: "block" }}
                stroke={1.5}
              />
            </ActionIcon>
          </Group>
        ) : (
          <Group>
            <UserActionMenu />
            <ActionIcon
              onClick={() => setColorScheme(isLight ? "dark" : "light")}
              variant="default"
              size={"xl"}
              aria-label="Toggle color scheme"
            >
              <IconMoon
                style={isLight ? { display: "block" } : { display: "none" }}
                stroke={1.5}
              />
              <IconSun
                style={isLight ? { display: "none" } : { display: "block" }}
                stroke={1.5}
              />
            </ActionIcon>
          </Group>
        )}
      </Grid.Col>
    </Grid>
  );
};

export default Navbar;

function createStyles(arg0: (theme: any) => {}) {
  throw new Error("Function not implemented.");
}
