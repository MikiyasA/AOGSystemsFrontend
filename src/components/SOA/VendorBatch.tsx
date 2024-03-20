import { formatDate } from "@/config/util";
import {
  Badge,
  Box,
  Button,
  Card,
  Group,
  NumberFormatter,
  SimpleGrid,
  Text,
  Title,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconAt, IconCircleArrowUpRight, IconUser } from "@tabler/icons-react";
import { VendorForm } from "./SOAForms";
import { useRouter } from "next/router";
import { useState } from "react";

export const VendorBatch = ({ data }: any) => {
  const outstandingPercentage =
    (data?.totalOutstanding / data?.creditLimit) * 100;
  const statusBadge =
    outstandingPercentage < 50
      ? "Good"
      : outstandingPercentage < 70
      ? "Normal"
      : "Critical";
  const statusColor =
    outstandingPercentage < 50
      ? "green"
      : outstandingPercentage < 70
      ? "blue"
      : "red";

  const certificateExpiryDate = new Date(data?.certificateExpiryDate);
  const today = new Date();
  const differenceCertMs = certificateExpiryDate.getTime() - today.getTime();
  const leftCertExpDate = Math.ceil(differenceCertMs / (1000 * 60 * 60 * 24));
  const certExpDateColor =
    leftCertExpDate > 30 ? "green" : leftCertExpDate > 15 ? "blue" : "Red";

  const assessmentDate = new Date(data?.assessmentDate);
  const differenceAsstMs = assessmentDate.getTime() - today.getTime();
  const leftAssDate = Math.ceil(differenceAsstMs / (1000 * 60 * 60 * 24));

  const assDateColor =
    leftAssDate > 30 ? "green" : leftAssDate > 15 ? "blue" : "Red";

  const router = useRouter();
  return (
    <>
      {data && (
        <Card shadow="sm" p={30} radius="md" withBorder>
          <Card.Section>
            <Group justify="space-between">
              <Title order={5}>
                {`${data.vendorCode} (${data.vendorName})`}
                <IconCircleArrowUpRight
                  cursor="pointer"
                  color="green"
                  size={20}
                  onClick={() =>
                    modals.open({
                      title: "Update Vendor",
                      size: "80%",
                      children: <VendorForm data={data} action="update" />,
                    })
                  }
                />
              </Title>
              <Badge color={statusColor}>{statusBadge}</Badge>
            </Group>
          </Card.Section>
          <Card.Section>
            <Text fz={13}>{data.address}</Text>
          </Card.Section>
          <Card.Section>
            <Box>
              <Box my={5}>
                <Title order={6}>Account ManagerName</Title>
                <Group align="start">
                  <Group gap={3}>
                    <IconUser size={20} />
                    <Text fz={13}>{data.vendorAccountManagerName}</Text>
                  </Group>
                  <Group gap={3}>
                    <IconAt size={20} />
                    <Text fz={13}>{data.vendorAccountManagerEmail}</Text>
                  </Group>
                </Group>
              </Box>
              <Box my={5}>
                <Title order={6}>Vendor Finance Representative</Title>
                <Group align="start">
                  <Group gap={3}>
                    <IconUser size={20} />
                    <Text fz={13}>{data.vendorFinanceContactName}</Text>
                  </Group>
                  <Group gap={3}>
                    <IconAt size={20} />
                    <Text fz={13}>{data.vendorFinanceContactEmail}</Text>
                  </Group>
                </Group>
              </Box>
              <Box my={5}>
                <Title order={6}>ET Finance Representative</Title>
                <Group align="start">
                  <Group gap={3}>
                    <IconUser size={20} />
                    <Text fz={13}>{data.etFinanceContactName}</Text>
                  </Group>
                  <Group gap={3}>
                    <IconAt size={20} />
                    <Text fz={13}>{data.etFinanceContactEmail}</Text>
                  </Group>
                </Group>
              </Box>
              <Box my={5}>
                <Title order={6}>ET Buyer Representative</Title>
                <Group align="start">
                  <Group gap={3}>
                    <IconUser size={20} />
                    <Text fz={13}>{data.soaHandlerBuyerName}</Text>
                  </Group>
                </Group>
              </Box>
            </Box>
          </Card.Section>
          <Card.Section my={5}>
            <Group>
              <Text fz={14}>Credit Limit:</Text>
              <NumberFormatter
                style={{ fontSize: 14 }}
                prefix="$"
                value={data.creditLimit?.toFixed(2)}
                thousandSeparator
              />
            </Group>
            <SimpleGrid cols={2} verticalSpacing={"0px"}>
              <Group>
                <Text fz={14}>Total Outstanding:</Text>
                <NumberFormatter
                  style={{ fontSize: 14 }}
                  prefix="$"
                  value={data.totalOutstanding?.toFixed(2)}
                  thousandSeparator
                />
              </Group>
              <Group>
                <Text fz={14}>Under Process:</Text>
                <NumberFormatter
                  style={{ fontSize: 14 }}
                  prefix="$"
                  value={data.underProcess?.toFixed(2)}
                  thousandSeparator
                />
              </Group>
              <Group>
                <Text fz={14}>Under Dispute:</Text>
                <NumberFormatter
                  style={{ fontSize: 14 }}
                  prefix="$"
                  value={data.underDispute?.toFixed(2)}
                  thousandSeparator
                />
              </Group>
              <Group>
                <Text fz={14}>Paid Amount:</Text>
                <NumberFormatter
                  style={{ fontSize: 14 }}
                  prefix="$"
                  value={data.paidAmount?.toFixed(2)}
                  thousandSeparator
                />
              </Group>
            </SimpleGrid>
          </Card.Section>
          <Card.Section>
            <Group>
              <Group gap={3}>
                <Text fz={13}>Certificate Expire Date:</Text>
                <Badge c={"black"} color={certExpDateColor}>
                  {formatDate(data.certificateExpiryDate)}
                </Badge>
              </Group>
              <Group>
                <Text fz={13}>Assessment Date</Text>
                <Badge c={"black"} color={assDateColor}>
                  {formatDate(data.assessmentDate)}
                </Badge>
              </Group>
            </Group>
          </Card.Section>
          <Card.Section mt={10} mb={20}>
            <Button
              px={20}
              pos={"absolute"}
              right={20}
              onClick={() => router.push(`/soa/detail/${data.id}`)}
            >
              Detail
            </Button>
          </Card.Section>
        </Card>
      )}
    </>
  );
};

export default VendorBatch;

export const VendorDetailBatch = ({ data }: any) => {
  const outstandingPercentage =
    (data?.totalOutstanding / data?.creditLimit) * 100;
  const statusBadge =
    outstandingPercentage < 50
      ? "Good"
      : outstandingPercentage < 70
      ? "Normal"
      : "Critical";
  const statusColor =
    outstandingPercentage < 50
      ? "green"
      : outstandingPercentage < 70
      ? "blue"
      : "red";

  const certificateExpiryDate = new Date(data?.certificateExpiryDate);
  const today = new Date();
  const differenceCertMs = certificateExpiryDate.getTime() - today.getTime();
  const leftCertExpDate = Math.ceil(differenceCertMs / (1000 * 60 * 60 * 24));
  const certExpDateColor =
    leftCertExpDate > 30 ? "green" : leftCertExpDate > 15 ? "blue" : "Red";

  const assessmentDate = new Date(data?.assessmentDate);
  const differenceAsstMs = assessmentDate.getTime() - today.getTime();
  const leftAssDate = Math.ceil(differenceAsstMs / (1000 * 60 * 60 * 24));

  const assDateColor =
    leftAssDate > 30 ? "green" : leftAssDate > 15 ? "blue" : "Red";

  const [show, setShow] = useState(false);
  return (
    <>
      <Box
        px={5}
        component="button"
        style={{
          backgroundColor: "transparent",
          border: "ridge 1px",
          borderRadius: 5,
          cursor: "pointer",
        }}
        onClick={() => setShow(!show)}
        fz={13}
      >
        {show ? "Hide Detail" : "Show Detail"}
      </Box>
      {show && (
        <Box>
          <Group>
            <Title order={5}>
              {`${data.vendorCode} (${data.vendorName})`}
              <IconCircleArrowUpRight
                cursor="pointer"
                color="green"
                size={20}
                onClick={() =>
                  modals.open({
                    title: "Update Vendor",
                    size: "80%",
                    children: <VendorForm data={data} action="update" />,
                  })
                }
              />
            </Title>
            <Badge color={statusColor}>{statusBadge}</Badge>
          </Group>
          <Text fz={13}>{data.address}</Text>
          <Box>
            <Box>
              <Box my={5}>
                <Title order={6}>Account ManagerName</Title>
                <Box>
                  <Group gap={3}>
                    <IconUser size={20} />
                    <Text fz={13}>{data.vendorAccountManagerName}</Text>
                  </Group>
                  <Group gap={3}>
                    <IconAt size={20} />
                    <Text fz={13}>{data.vendorAccountManagerEmail}</Text>
                  </Group>
                </Box>
              </Box>
              <Box my={5}>
                <Title order={6}>Vendor Finance Representative</Title>
                <Box>
                  <Group gap={3}>
                    <IconUser size={20} />
                    <Text fz={13}>{data.vendorFinanceContactName}</Text>
                  </Group>
                  <Group gap={3}>
                    <IconAt size={20} />
                    <Text fz={13}>{data.vendorFinanceContactEmail}</Text>
                  </Group>
                </Box>
              </Box>
              <Box my={5}>
                <Title order={6}>ET Finance Representative</Title>
                <Box>
                  <Group gap={3}>
                    <IconUser size={20} />
                    <Text fz={13}>{data.etFinanceContactName}</Text>
                  </Group>
                  <Group gap={3}>
                    <IconAt size={20} />
                    <Text fz={13}>{data.etFinanceContactEmail}</Text>
                  </Group>
                </Box>
              </Box>
              <Box my={5}>
                <Title order={6}>ET Buyer Representative</Title>
                <Box>
                  <Group gap={3}>
                    <IconUser size={20} />
                    <Text fz={13}>{data.soaHandlerBuyerName}</Text>
                  </Group>
                </Box>
              </Box>
            </Box>
          </Box>
          <Box my={5}>
            <Group>
              <Text fz={14}>Credit Limit:</Text>
              <NumberFormatter
                style={{ fontSize: 14 }}
                prefix="$"
                value={data.creditLimit?.toFixed(2)}
                thousandSeparator
              />
            </Group>
            <SimpleGrid cols={1} verticalSpacing={"0px"}>
              <Group>
                <Text fz={14}>Total Outstanding:</Text>
                <NumberFormatter
                  style={{ fontSize: 14 }}
                  prefix="$"
                  value={data.totalOutstanding?.toFixed(2)}
                  thousandSeparator
                />
              </Group>
              <Group>
                <Text fz={14}>Under Process:</Text>
                <NumberFormatter
                  style={{ fontSize: 14 }}
                  prefix="$"
                  value={data.underProcess?.toFixed(2)}
                  thousandSeparator
                />
              </Group>
              <Group>
                <Text fz={14}>Under Dispute:</Text>
                <NumberFormatter
                  style={{ fontSize: 14 }}
                  prefix="$"
                  value={data.underDispute?.toFixed(2)}
                  thousandSeparator
                />
              </Group>
              <Group>
                <Text fz={14}>Paid Amount:</Text>
                <NumberFormatter
                  style={{ fontSize: 14 }}
                  prefix="$"
                  value={data.paidAmount?.toFixed(2)}
                  thousandSeparator
                />
              </Group>
            </SimpleGrid>
          </Box>
          <Box>
            <Box>
              <Group mb={5}>
                <Text fz={13}>Certificate Expire Date:</Text>
                <Badge c={"black"} color={certExpDateColor}>
                  {formatDate(data.certificateExpiryDate)}
                </Badge>
              </Group>
              <Group>
                <Text fz={13}>Assessment Date</Text>
                <Badge c={"black"} color={assDateColor}>
                  {formatDate(data.assessmentDate)}
                </Badge>
              </Group>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};
