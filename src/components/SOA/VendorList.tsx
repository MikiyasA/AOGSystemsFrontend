import { Box, SimpleGrid, Title } from "@mantine/core";
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import VendorBatch from "./VendorBatch";

const VendorList = ({ data, title }: any) => {
  return (
    <>
      <Box m={20}>
        <Title order={3}>{title}</Title>
      </Box>
      <SimpleGrid cols={3}>
        {data?.map((item: any, i: any) => (
          <VendorBatch key={i} data={item} />
        ))}
      </SimpleGrid>
    </>
  );
};

export default VendorList;
