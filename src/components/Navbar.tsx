import React, { useEffect, useState } from "react";
import {
  Image,
  Grid,
  Group,
  Button,
  ActionIcon,
  useMantineColorScheme,
  useComputedColorScheme,
  useMantineTheme,
  Menu,
  Box,
} from "@mantine/core";
import Link from "next/link";
import classes from "../styles/Navbar.module.css";
import { modals } from "@mantine/modals";
import Login from "@/pages/login";
import { IconCaretRightFilled, IconMoon, IconSun } from "@tabler/icons-react";
import { getSession, signOut, useSession } from "next-auth/react";
import UserActionMenu from "./User/UserActionMenu";
import { useRouter } from "next/router";

const links = [
  { link: "/", label: "Home", role: ["All"] },
  {
    link: "/AOGFollowUp",
    label: "AOG Follow Up",
    role: ["Coordinator", "TL", "Management"],
  },
  { link: "/assignment", label: "Assignment", role: ["Coordinator", "TL"] },
  {
    link: "/corefollowup",
    label: "Core Followup",
    role: ["Coordinator", "TL", "Management"],
  },
  {
    link: "/costSaving",
    label: "Cost Saving",
    role: ["Coordinator", "TL", "Management"],
  },
  {
    inactiveLink: "/part",
    label: "Part",
    subLinks: [
      { link: "/part/add_part", label: "Add Part" },
      { link: "/part/search", label: "Part Search" },
    ],
    role: ["Coordinator", "TL", "Management"],
  },
  {
    inactiveLink: "/company",
    label: "Company",
    subLinks: [
      { link: "/company/add_company", label: "Add Company" },
      { link: "/company/search", label: "Company Search" },
    ],
    role: ["Coordinator", "TL", "Management"],
  },
  { link: "/sales", label: "Sales", role: ["Coordinator", "TL", "Management"] },
  { link: "/loan", label: "Loan", role: ["Coordinator", "TL", "Management"] },
  {
    link: "/invoice",
    label: "Invoice",
    subLinks: [{ link: "/invoice/search", label: "Invoice Search" }],
    role: ["Coordinator", "TL", "Management"],
  },
  {
    link: "/soa",
    label: "SOA",
    role: ["Coordinator", "TL", "Management", "Buyer", "Finance"],
  },
  { link: "/admin", label: "Admin", role: ["Admin"] },
];

const Navbar = () => {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

  const { data: session, status } = useSession();
  status === "authenticated" && modals.closeAll();

  const router = useRouter();
  const [activeLink, setActiveLink] = useState("");

  // Update the active link whenever the route changes
  useEffect(() => {
    setActiveLink(router.pathname);
  }, [router.pathname]);

  const items = links.map((link) => {
    const user: any = session?.user;
    const flattenedRoles = user?.role?.flat();
    const allowedRoles = link.role;
    !flattenedRoles?.includes("All") && flattenedRoles?.push("All");
    !allowedRoles?.includes("Admin") && allowedRoles?.push("Admin");
    const haveAccess = flattenedRoles?.some((r: any) =>
      allowedRoles.includes(r)
    );

    const activeSplitList = `/${activeLink.split("/")[1]}`;
    const isActive = (link.link || link.inactiveLink) === activeSplitList;
    const linkStyle = isActive ? classes.activeLink : classes.link;

    if (haveAccess)
      return (
        <Group key={link.label} gap={5}>
          <Link
            key={link.label}
            href={link.link ? link.link : "#"}
            className={`${classes.link} ${isActive ? classes.activeLink : ""}`}
          >
            {link.label}
          </Link>

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
        </Group>
      );
  });

  // const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  // const theme = useMantineTheme();
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

      <Grid.Col span={8}>
        <Group ml={50} gap={15} className={classes.linksGroup} visibleFrom="sm">
          {items}
        </Group>
      </Grid.Col>
      <Grid.Col span="auto">
        {!session ? (
          <Group
            style={{
              right: "10px",
              justifyContent: "center",
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
          <Group style={{ justifyContent: "center" }}>
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
