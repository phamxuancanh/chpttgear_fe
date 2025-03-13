/* eslint-disable no-undef */
import React, { useEffect, useState, useMemo } from 'react'
import Select, { MultiValue } from 'react-select'
import {
    useMaterialReactTable,
    MRT_GlobalFilterTextField,
    MRT_ShowHideColumnsButton,
    MRT_TableContainer,
    MRT_TablePagination,
    MRT_ToggleDensePaddingButton,
    MRT_ToolbarAlertBanner,
    MRT_ToggleFullScreenButton
} from 'material-react-table'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import SearchIcon from '@mui/icons-material/Search'
import { Box, Button, DialogActions, DialogContent, DialogTitle, IconButton, LinearProgress, Skeleton, Tooltip, Typography } from '@mui/material'
import { searchProducts } from '../../routers/ApiRoutes'

const TableProduct = () => {
    const [rowSelection, setRowSelection] = useState(null)
    const [globalFilter, setGlobalFilter] = useState('')
    const [dataTable, setDataTable] = useState(null)
    const [pagination, setPagination] = useState <MRT_TablePagination> ({
        pageIndex: 0,
        pageSize: 5
    })
    const [isFinding, setIsFinding] = useState(false)
    const [loading, setLoading] = useState(null)
    const [products, setProducts] = useState(null)
    const [selectedCourses, setSelectedCourses] = useState(null)
    const [selectedGroups, setSelectedGroups] = useState(null)
    const [isExporting, setIsExporting] = useState(false)

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await searchProducts()
                const courses = response.data
                setProducts(courses)
            } catch (error) {
                console.error('Failed to fetch courses:', error)
            }
        }
        fetchCourses()
    }, [])

    useEffect(() => {
        // const fetchCoursesDoneByUsers = async () => {
        //     setLoading(true)
        //     try {
        //         const response = await getCourseDoneDashboard({

        //             params: {
        //                 page: pagination.pageIndex + 1,
        //                 size: pagination.pageSize,
        //                 userSearch: globalFilter || '',
        //                 courseSearch: JSON.stringify(selectedCourses),
        //                 groupSearch: JSON.stringify(selectedGroups)
        //             }
        //         })
        //         setDataTable(response.data)
        //     } catch (e) {
        //         console.error(e)
        //     } finally {
        //         setLoading(false)
        //     }
        // }
        // fetchCoursesDoneByUsers()
        // setIsFinding(false)
    }, [pagination.pageIndex, pagination.pageSize, dataTable?.pageSize, isFinding])
    
    const columns = useMemo < Array < MRT_ColumnDef < any >>> (
        () => [
            {
                accessorKey: 'userId',
                header: 'ID',
                enableHiding: true,
                enableEditing: false,
                enableColumnActions: false,
                enableSorting: false,
                enableColumnFilter: false,
                grow: true,
                size: 30
            },
            {
                accessorKey: 'groupName',
                header: 'a',
                enableHiding: true,
                enableEditing: false,
                enableColumnActions: false,
                enableSorting: false,
                enableColumnFilter: false,
                size: 100
            },
            {
                accessorKey: 'name',
                header: 'a',
                enableHiding: true,
                enableEditing: false,
                enableColumnActions: false,
                enableSorting: false,
                enableColumnFilter: false,
                size: 100
            },
            {
                accessorKey: 'coursesCount',
                header: 'a',
                enableHiding: true,
                enableColumnActions: false,
                enableSorting: false,
                enableColumnFilter: false,
                size: 100,
                Cell: ({ cell }) => cell.row.original.coursesCount > 1 ? `${cell.row.original.coursesCount} san pham` : `${cell.row.original.coursesCount} san pham`
            },
            {
                accessorKey: 'courseDones',
                header: 'a',
                enableHiding: true,
                enableColumnActions: false,
                enableSorting: false,
                enableColumnFilter: false,
                Cell: ({ cell }) => (
                    <>
                        {cell.row.original.courseDones.length === 0 ? (
                            <div className='text-gray-500 italic'>kHONG CO SP</div>
                        ) : (
                            <div className='font-bold'>
                                {cell.row.original.courseDones.map((course, index, array) => (
                                    <span key={course.courseName} style={{ display: 'block' }}>
                                        {course.courseName}{index < array.length - 1 ? ',' : ''}
                                    </span>
                                ))}
                            </div>
                        )}
                    </>
                )
            }
        ],
        [dataTable?.data]
    )
    const handleExportRows = async (rows) => {
        if (rows.length === 0) return;
        setIsExporting(true);
        await new Promise(resolve => setTimeout(resolve, 2000));

        let csvContent = '\uFEFF';
        const headers = [
            { label: 'userID', value: 'userId' },
            { label: 'Group name', value: 'groupName' },
            { label: 'Full name', value: 'name' },
            { label: 'Courses length done', value: 'coursesCount' },
            { label: 'Completed courses', value: 'courseDones' }
        ];

        csvContent += headers.map(header => header.label).join(',') + '\n';

        rows.forEach((row) => {
            const values = headers.map(header => {
                let value = row.original[header.value];
                if (header.value === 'courseDones' && Array.isArray(value)) {
                    value = `"${value.map(course => course.courseName).join(', ')}"`;
                } else if (typeof value === 'string') {
                    if (value.includes(',')) {
                        value = `"${value}"`;
                    }
                    if (value.includes('"')) {
                        value = `"${value.replace(/"/g, '""')}"`;
                    }
                }
                return value;
            });
            csvContent += values.join(',') + '\n';
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'selectedData.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        setIsExporting(false);
    };

    // ALL DATA
    /**
     * Exports all user data to a CSV file.
     *
     * This function retrieves all data from the server in batches,
     * compiles it into CSV format, and triggers a download of the CSV file.
     *
     * @author Canh
     */
    const handleExportAllData = async () => {
        setIsExporting(true)
        console.log('Exporting all data...')
        let csvContent = '\uFEFF'
        let allUsersData = []
        let pageIndex = 1
        const pageSize = 100

        const fetchPageData = async (pageIndex) => {
            try {
                const response = await getCourseDoneDashboard({
                    params: {
                        page: pageIndex,
                        size: pageSize,
                        userSearch: globalFilter || '',
                        courseSearch: JSON.stringify(selectedCourses),
                        groupSearch: JSON.stringify(selectedGroups)
                    }
                })
                return response.data
            } catch (e) {
                console.error(e)
                return null
            }
        }
        let pageData = await fetchPageData(pageIndex)
        console.log(pageData, 'pageData')
        while (allUsersData.length < (pageData?.totalRecords ?? 0)) {
            console.log('loop')
            if (pageData && pageData.data && pageData.data.length > 0) {
                allUsersData = allUsersData.concat(pageData.data)
                console.log(allUsersData, 'allUsersDataaaaa')
                pageIndex++
                pageData = await fetchPageData(pageIndex)
            } else {
                break
            }
        }
        if (allUsersData.length > 0) {
            const headers = [
                { label: 'userID', value: 'userId' },
                { label: 'Group name', value: 'groupName' },
                { label: 'Full name', value: 'name' },
                { label: 'Courses length done', value: 'coursesCount' },
                { label: 'Completed courses', value: 'courseDones' }
            ];
            csvContent += headers.map(header => header.label).join(',') + '\n'

            allUsersData.forEach((user) => {
                const rowValues = Object.keys(user)
                const courseNames = `"${user.courseDones.map((course) => course.courseName).join(', ')}"`
                const courseDoneLength = user.coursesCount
                const groupName = user.groupName
                const rowContent = [user.userId, groupName, user.name, courseDoneLength, courseNames].join(',')
                csvContent += rowContent + '\r\n'
            })
        }
        setTimeout(() => {
            setIsExporting(false)

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = 'filename.csv'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(url)
        }, 2000)
    }

    const table = useMaterialReactTable({
        columns,
        data: dataTable?.data ?? [],
        manualFiltering: true,
        enableRowSelection: true,
        // selectRow: true,
        onGlobalFilterChange: setGlobalFilter,
        enableFilterMatchHighlighting: true,
        enableFullScreenToggle: true,
        muiTableBodyRowProps: ({ row }) => ({
            onClick: () => {
                setRowSelection((prev) => ({
                    ...prev,
                    [row.id]: !prev[row.id]
                }))
            },
            selected: rowSelection[row.id],
            sx: {
                cursor: 'pointer'
            }
        }),
        onRowSelectionChange: (newSelection) => {
            const oldSelection = { ...rowSelection }
            setRowSelection(newSelection)
        },
        onPaginationChange: setPagination,
        paginationDisplayMode: 'pages',
        muiPaginationProps: {
            showRowsPerPage: true,
            color: 'standard',
            shape: 'rounded',
            variant: 'outlined',
            sx: {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                // '.MuiRowsPerPage-select': {
                //   display: 'none',
                //   backgroundColor: 'red'
                // },
                '.MuiPagination-ul': {
                    display: 'inline-flex',
                    fontSize: 'large',
                    listStyle: 'none',
                    margin: '10px',
                    '@media (max-width: 600px)': {
                        margin: '5px'
                    }
                },
                '.MuiPaginationItem-root': {
                    fontSize: 'large',
                    fontWeight: 'bold',
                    borderRadius: '4px',
                    margin: '2px',
                    border: '1px solid #cbd5e0',
                    backgroundColor: 'white',
                    color: '#718096',
                    '&:hover': {
                        backgroundColor: '#667eea',
                        color: 'white'
                    },
                    '@media (max-width: 600px)': {
                        margin: '0px'
                    }
                },
                '.MuiPaginationItem-firstLast': {
                    borderRadius: '4px'
                },
                '.MuiPaginationItem-previousNext': {
                    borderRadius: '4px',
                    margin: '10px',
                    '@media (min-width: 600px)': {
                        margin: '20px'
                    },
                    '@media (max-width: 600px)': {
                        fontSize: 'medium',
                        margin: '0px'
                    }
                },
                '.MuiPaginationItem-page.Mui-selected': {
                    color: '#667eea',
                    fontWeight: 'bold',
                    border: '2px solid #667eea',
                    '&:hover': {
                        backgroundColor: '#667eea',
                        color: 'white'
                    }
                },
                '.MuiPaginationItem-ellipsis': {
                    color: '#a0aec0',
                    border: '1px solid #cbd5e0',
                    backgroundColor: 'white',
                    padding: '2px',
                    margin: '0',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }
            }

        },
        manualPagination: true,
        rowCount: dataTable?.totalRecords,
        initialState: {
            pagination: { pageSize: 5, pageIndex: 0 },
            columnVisibility: { id: false },
            showGlobalFilter: true
        },
        getRowId: (row) => row?.userId?.toString() ?? 'unknown-id',
        muiTableHeadRowProps: {
            sx: {
                border: '1px solid rgba(81, 81, 81, .5)',
                backgroundColor: 'rgba(81, 81, 81, .1)',
                fontStyle: 'bold',
                fontWeight: 'bold'
            }
        },
        muiTableHeadCellProps: {
            sx: {
                border: '1px solid rgba(81, 81, 81, .5)',
                fontStyle: 'bold',
                fontWeight: 'bold'
            },
            align: 'center'
        },
        muiTableBodyCellProps: {
            sx: {
                border: '1px solid rgba(81, 81, 81, .5)'
            },
            align: 'center'
        },
        state: {
            showLoadingOverlay: !!loading || !!isExporting,
            showProgressBars: !!loading,
            showSkeletons: !!loading,
            pagination,
            rowSelection
        },
        rowNumberDisplayMode: 'original',
        layoutMode: 'grid',
        displayColumnDefOptions: {
            'mrt-row-numbers': {
                enableResizing: true,
                size: 40,
                grow: false
            },
            'mrt-row-drag': {
                enableResizing: true,
                size: 40,
                grow: false
            },
            'mrt-row-select': {
                enableResizing: true,
                size: 40,
                grow: false
            }
        }
    })

    return (
        <>
            <Box sx={{ border: 'gray 2px dashed', padding: '16px', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                {/* Our Custom External Top Toolbar */}
                <Box
                    sx={(theme) => ({
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: 'inherit',
                        borderRadius: '4px',
                        flexDirection: 'row',
                        gap: '10px',
                        justifyContent: 'space-between',
                        width: '100%',
                        padding: '24px 16px 16px 16px',
                        '@media (max-width: 800px)': {
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%',
                            padding: '24px 16px 16px 16px',
                            margin: '0 auto',
                            background: 'rgba(81, 81, 81, .1)'
                        }
                    })}
                >
                    <div className="flex lg:w-1/3 w-4/5 items-center space-x-4 z-20">
                        <label htmlFor="courseSelect" className="font-bold">San pham: </label>
                        <Select
                            id="courseSelect"
                            className="w-full ml-3"
                            isMulti
                            options={products.map(course => ({ value: course.name, label: course.name }))}
                            value={selectedCourses.map(courseName => ({
                                value: courseName,
                                label: products.find(course => course.name === courseName)?.name ?? 'None'
                            }))}
                            onChange={(options) => {
                                setSelectedCourses(options.map(option => option.value))
                            }}
                        />
                    </div>
                    <div className='flex lg:w-1/3 w-3/5  items-center justify-center'>
                        <MRT_GlobalFilterTextField table={table} placeholder='Tim' />
                    </div>
                    <Box>
                        <Button
                            className='w-full'
                            color="primary"
                            // onClick={() => handleFind()}
                            startIcon={<SearchIcon />}
                            variant="contained"
                        >
                            search
                        </Button>
                    </Box>
                    {/* </form> */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <MRT_ShowHideColumnsButton table={table} />
                        <MRT_ToggleDensePaddingButton table={table} />
                    </Box>
                </Box>
                <Box
                    sx={(theme) => ({
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: 'inherit',
                        borderRadius: '4px',
                        flexDirection: 'row',
                        gap: '16px',
                        justifyContent: 'space-between',
                        flexGrow: 1,
                        padding: '24px 16px 16px 16px',
                        '@media (max-width: 800px)': {
                            flexDirection: 'column'
                        }
                    })}
                >
                    <Box
                        sx={(theme) => ({
                            display: 'flex',
                            alignItems: 'center',
                            backgroundColor: 'inherit',
                            borderRadius: '4px',
                            flexDirection: 'row',
                            gap: '16px',
                            justifyContent: 'space-between',
                            width: '70%',
                            '@media (max-width: 800px)': {
                                width: '100%'
                            }
                        })}>
                        <Button
                            onClick={handleExportAllData}
                            disabled={isExporting}
                            startIcon={<FileDownloadIcon />}
                        >
                            ALL data
                        </Button>
                        <Button
                            disabled={table.getRowModel().rows.length === 0 || isExporting}
                            onClick={async () => await handleExportRows(table.getRowModel().rows)}
                            startIcon={<FileDownloadIcon />}
                        >
                            export page row
                        </Button>
                        <Button
                            disabled={
                                table.getSelectedRowModel().rows.length === 0 || isExporting
                            }
                            onClick={async () => await handleExportRows(table.getSelectedRowModel().rows)}
                            startIcon={<FileDownloadIcon />}
                        >
                            export selected row
                        </Button>
                    </Box>
                </Box>
                {loading && <LinearProgress />}
                {loading && <LinearProgress />}
                <MRT_TableContainer table={table} />

                <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <MRT_TablePagination table={table} />
                    </Box>
                    <Box sx={{ display: 'grid', width: '100%' }}>
                        <MRT_ToolbarAlertBanner stackAlertBanner table={table} />
                    </Box>
                </Box>
            </Box>
        </>
    )
}

export default TableProduct
