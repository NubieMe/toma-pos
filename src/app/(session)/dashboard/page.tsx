/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip
} from 'chart.js'
import { useEffect, useState } from 'react'
import { Bar, Doughnut, Line } from 'react-chartjs-2'

// Import komponen Material-UI
import { Box, CircularProgress, Grid, Paper, Typography } from '@mui/material'
import Range from './components/range'
import Summary from './components/summary'
import { faker } from '@faker-js/faker'
import { TokenOutlined } from '@mui/icons-material'
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';

// Register komponen Chart.js yang dibutuhkan
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement
)

// Data transaksi untuk chart
interface TransactionData {
  amount: number
  qty: number
  date: string
}

interface ProductData {
  name: string
  totalSales: number
}

interface BranchData {
  name: string
  totalSales: number
}

interface AttendanceData {
  totalUsers: number
  attendedCount: number
  attendancePercentage: number
}

interface DashboardData {
  transactions: TransactionData[]
  products: ProductData[]
  branchAnalysis: BranchData[]
  attendance: AttendanceData
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const DashboardPage = () => {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [transactionRange, setTransactionRange] = useState<RangeType>('month')
  const [branchRange, setBranchRange] = useState<RangeType>('month')
  const [productRange, setProductRange] = useState<RangeType>('month')
  const [attendanceRange, setAttendanceRange] = useState<RangeType>('month')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/dashboard?trxRange=${transactionRange}&branchRange=${branchRange}&productRange=${productRange}&attendanceRange=${attendanceRange}`)
        if (!res.ok) {
          throw new Error('Gagal mengambil data dari API')
        }
        const result = await res.json()
        setData(result)
      } catch (e) {
        setError((e as Error).message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [transactionRange, branchRange, productRange, attendanceRange])

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6" color="error" align="center">
          Error: {error}
        </Typography>
      </Box>
    )
  }

  if (!data) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6" align="center">
          Tidak ada data yang tersedia.
        </Typography>
      </Box>
    )
  }

  // Mengolah data untuk chart
  const transactionLabels = data.transactions.map(t => transactionRange === 'year' ? t.date : new Date(t.date).toLocaleDateString())

  // const productLabels = data.products.map(p => p.name)
  // const productSales = data.products.map(p => p.totalSales)

  const branchLabels = data.branchAnalysis.map(b => b.name)
  // const branchSales = data.branchAnalysis.map(b => b.totalSales)

  // const attendanceData = [data.attendance.attendedCount, data.attendance.totalUsers - data.attendance.attendedCount]

  return (
    <Box>
      <Grid container spacing={4}>
        <Grid container size={{ xs: 12, xl: 6 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Summary
              title='Transaksi Harian'
              now={faker.number.int({ min: 100, max: 2000 })}
              then={faker.number.int({ min: 100, max: 2000 })}
            >
              <TokenOutlined />
            </Summary>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Summary
              title='Income Harian (Rp)'
              now={faker.number.int({ min: 10000, max: 20000000 })}
              then={faker.number.int({ min: 10000, max: 20000000 })}
            >
              <AttachMoneyOutlinedIcon />
            </Summary>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Paper sx={{ p: 2, borderRadius: 5 }}>
              <Box className='flex justify-between'>
                <Typography variant='h6' component='h2'>
                  Monthly
                </Typography>
              </Box>
              <Bar
                data={{
                  labels: months,
                  datasets: [
                    {
                      label: 'Penjualan per Bulan',
                      data: months.map(() => faker.number.int({ min: 10000, max: 20000000 })),
                      backgroundColor: 'rgb(53, 162, 235)',
                    }
                  ]
                }}
              />
            </Paper>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12, xl: 6 }}>
          <Paper elevation={3} sx={{ p: 2, borderRadius: 5 }}>
            <Box className='flex justify-between'>
              <Typography variant="h6" component="h2" gutterBottom>
                Transaksi per Cabang
              </Typography>
              <Range value={branchRange} setValue={() => {
                // setBranchRange
              }} />
            </Box>
            <Box sx={{ height: 500, mx: 'auto', marginTop: 7 }}>
              <Doughnut
                data={{
                  labels: branchLabels,
                  datasets: [
                    {
                      label: 'Total Penjualan',
                      data: branchLabels.map(() => faker.number.int({ min: 100, max: 2000 })),
                      backgroundColor: [
                        'rgba(255, 99, 132, 0.5)',
                        'rgba(54, 162, 235, 0.5)',
                        'rgba(255, 206, 86, 0.5)',
                        'rgba(75, 192, 192, 0.5)',
                      ],
                      borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                      ],
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Chart 2: Produk Terlaris */}
        {/* <Grid size={{ xs: 12, xl: 6 }}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Box className='flex justify-between'>
              <Typography variant="h6" component="h2" gutterBottom>
                Produk Terlaris
              </Typography>
              <Range value={productRange} setValue={setProductRange} />
            </Box>
            <Bar
              data={{
                labels: productLabels,
                datasets: [
                  {
                    label: 'Total Penjualan (Rp)',
                    data: productSales,
                    backgroundColor: 'rgba(53, 162, 235, 0.5)',
                  },
                ],
              }}
              options={{ responsive: true }}
            />
          </Paper>
        </Grid> */}

        {/* Chart 3: Analisis Cabang */}
        <Grid size={{ xs: 12 }}>
          <Paper elevation={3} sx={{ p: 2, borderRadius: 5 }}>
            <Box className='flex justify-between'>
              <Typography variant="h6" component="h2" gutterBottom>
                Grafik Transaksi
              </Typography>
              <Range value={transactionRange} setValue={() => {
                // setTransactionRange
              }} />
            </Box>
            <Line
              data={{
                labels: transactionLabels,
                datasets: [
                  {
                    label: 'Total Penjualan (Rp)',
                    data: data.transactions.map(t => t.amount),
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1,
                  },
                  {
                    label: 'Jumlah Transaksi',
                    data: data.transactions.map(t => t.qty),
                    borderColor: 'rgb(53, 162, 235)',
                    tension: 0.1,
                  }
                ],
              }}
              options={{ responsive: true }}
            />
          </Paper>
        </Grid>

        {/* Chart 4: Persentase Kehadiran Karyawan */}
        {/* <Grid size={{ xs: 12, xl: 6 }}>
          <Paper elevation={3} sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box className='flex justify-between w-full'>
              <Typography variant="h6" component="h2" gutterBottom>
                Persentase Kehadiran
              </Typography>
              <Range value={attendanceRange} setValue={setAttendanceRange} />
            </Box>
            <Box sx={{ width: '100%', maxWidth: '250px' }}>
              <Doughnut
                data={{
                  labels: ['Hadir', 'Tidak Hadir'],
                  datasets: [
                    {
                      label: 'Jumlah Karyawan',
                      data: attendanceData,
                      backgroundColor: ['rgba(60, 179, 113, 0.5)', 'rgba(255, 99, 132, 0.5)'],
                      borderColor: ['rgba(60, 179, 113, 1)', 'rgba(255, 99, 132, 1)'],
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  cutout: '70%',
                  plugins: {
                    legend: { position: 'bottom' },
                    title: {
                      display: true,
                      text: `${data.attendance.attendancePercentage}%`,
                      font: {
                        size: 20
                      },
                      padding: {
                        top: 20,
                        bottom: 0
                      }
                    },
                  },
                }}
              />
            </Box>
          </Paper>
        </Grid> */}
      </Grid>
    </Box>
  )
}

export default DashboardPage