import React, { useMemo } from 'react';
import GridTable from '@nadavshaar/react-grid-table';
import { Box, IconButton, Button, chakra } from '@chakra-ui/react';
import { IoMdEye, IoMdTrash } from 'react-icons/io';
import { IoPencil } from 'react-icons/io5';
import { IoMdAnalytics } from 'react-icons/io';
import { BiBarcodeReader } from 'react-icons/bi';

const MyTableComponent = ({
  itemDataArray,
  handleDeleteItem,
  setPencilIconSelectedId,
  setOverlay,
  onOpenThree,
  setEyeIconSelectedId,
  onOpenTwo,
  handleGenerateBarcode,
  setbarCodeData,
  onOpenBarCode,
  setAnalyticsSelectedId,
  onOpenAnalytics,
  OverlayOne,
}) => {
  // Debugging: Log the raw item data
  console.log("Raw Item Data Array:", itemDataArray);

  const columns = useMemo(() => [
    {
      id: 'item_name',
      name: 'Item Name',
      width: '200px',
      resizable: true,
      sort: true,
      formatter: ({ row }) => (
        <chakra.div
          title={row.item_name}
          overflow="hidden"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
        >
          {row.item_name}
        </chakra.div>
      ),
    },
    { id: 'item_unit', name: 'Unit', width: '100px', sort: true },
    { id: 'available_quantity', name: 'Available', width: '100px', sort: true },
    { id: 'minimum_quantity', name: 'Minimum', width: '100px', sort: true },
    {
      id: 'existing_barcode_no',
      name: 'Barcode No.',
      width: '150px',
      resizable: true,
      formatter: ({ row }) => (
        <chakra.div
          title={row.existing_barcode_no}
          overflow="hidden"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
        >
          {row.existing_barcode_no || '--'}
        </chakra.div>
      ),
    },
    { id: 'updatedAt', name: 'Last Replenished', width: '150px', sort: true },
    { id: 'expiry_date', name: 'Expiry Date', width: '150px', sort: true },
    {
      id: 'action',
      name: 'Action',
      width: '300px',
      formatter: ({ row }) => (
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <IconButton
            aria-label="Delete Item"
            colorScheme="red"
            size="sm"
            icon={<IoMdTrash />}
            onClick={() => handleDeleteItem(row._id)}
          />
          <IconButton
            aria-label="Edit Item"
            colorScheme="yellow"
            size="sm"
            icon={<IoPencil />}
            onClick={() => {
              const inputPin = prompt('Enter your pin');
              setPencilIconSelectedId(row._id);
              setOverlay(<OverlayOne />);
              onOpenThree();
            }}
          />
          <IconButton
            aria-label="View Item"
            colorScheme="green"
            size="sm"
            icon={<IoMdEye />}
            onClick={() => {
              setEyeIconSelectedId(row._id);
              setOverlay(<OverlayOne />);
              onOpenTwo();
            }}
          />
          <IconButton
            aria-label="Generate Barcode"
            colorScheme="blue"
            size="sm"
            icon={<BiBarcodeReader />}
            onClick={() => {
              handleGenerateBarcode(row);
              setbarCodeData(row);
              onOpenBarCode();
            }}
          />
          <IconButton
            aria-label="Analytics"
            colorScheme="teal"
            size="sm"
            icon={<IoMdAnalytics />}
            onClick={() => {
              setAnalyticsSelectedId(row._id);
              onOpenAnalytics();
            }}
          />
        </Box>
      ),
    },
  ], []);

  const data = useMemo(() => itemDataArray.map(item => ({
    ...item,
    updatedAt: item.updatedAt.split('T')[0],
    expiry_date: item.expiry_date ? item.expiry_date.split('T')[0] : '--',
  })), [itemDataArray]);

  // Debugging: Log the processed data
  console.log("Processed Data for Table:", data);

  return (
    <Box mt="40px" bg="lightblue" p={4} borderRadius="md">
      <GridTable
        columns={columns}
        rows={data}
        resizable
        sortable
        pagination={{
          enabled: true,
          pageSize: 10,
          pageSizes: [10, 20, 30, 40, 50],
        }}
        style={{ height: 'auto', width: '100%' }}
      />
    </Box>
  );
};

export default MyTableComponent;
