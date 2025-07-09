import { Card, CardContent, Typography, Grid, Box } from '@mui/material'
import { Home, Person, Group } from '@mui/icons-material'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Toma POS',
}

export default async function DashboardPage() {

  const stats = [
    { icon: <Person fontSize="large" color="primary" />, label: 'Users', value: 32 },
    { icon: <Group fontSize="large" color="primary" />, label: 'Admins', value: 5 },
    { icon: <Home fontSize="large" color="primary" />, label: 'Outlets', value: 12 },
  ]

  return (
    <Box p={4} bgcolor="background.default" minHeight="100vh">
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Welcome to Toma POS Dashboard
      </Typography>
      <Grid container spacing={3}>
        {stats.map((item) => (
          <Grid key={item.label}>
            <Card sx={{ borderRadius: 4, boxShadow: 3 }}>
              <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {item.label}
                  </Typography>
                  <Typography variant="h5" fontWeight={600}>
                    {item.value}
                  </Typography>
                </Box>
                {item.icon}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}