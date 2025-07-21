import React, { useState } from 'react'
import { GoogleMap, useJsApiLoader, MarkerF, Autocomplete } from '@react-google-maps/api'
import { TextField, Box } from '@mui/material'

// Tipe props tidak berubah
interface MapPickerProps {
  value?: number[]
  onChange: (coords: number[]) => void
  disabled?: boolean
}

// Posisi default tetap sama
const defaultCenter = {
  lat: -6.2088,
  lng: 106.8456,
}

// Tambahkan 'places' ke dalam libraries yang akan di-load
const libraries: ('places')[] = ['places']

export default function MapPicker({ value, onChange, disabled }: MapPickerProps) {
  // State untuk menyimpan instance Autocomplete
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null)
  
  // State untuk menyimpan instance Peta itu sendiri
  const [map, setMap] = useState<google.maps.Map | null>(null)

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY!,
    libraries, // <-- Tambahkan ini
  })

  const markerPosition = value && value.length === 2 ? { lat: value[0], lng: value[1] } : undefined
  const mapCenter = markerPosition || defaultCenter

  // Handler saat peta di-klik (logika lama tetap ada)
  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (disabled) return

    const lat = event.latLng!.lat()
    const lng = event.latLng!.lng()
    onChange([lat, lng])
  }

  // Handler saat Autocomplete selesai loading
  const onAutocompleteLoad = (autocompleteInstance: google.maps.places.Autocomplete) => {
    setAutocomplete(autocompleteInstance)
  }

  // Handler saat pengguna memilih lokasi dari saran pencarian
  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace()
      const location = place.geometry?.location

      if (location) {
        const lat = location.lat()
        const lng = location.lng()
        
        // 1. Update state form melalui `onChange`
        onChange([lat, lng])

        // 2. Geser peta ke lokasi yang dipilih
        map?.panTo({ lat, lng })
        map?.setZoom(15)
      }
    } else {
      console.error('Autocomplete is not loaded yet!')
    }
  }

  if (!isLoaded) return <div>Loading Map...</div>

  return (
    <Box sx={{ position: 'relative' }}>
      {/* --- Komponen Pencarian --- */}
      {!disabled && (
        <Box sx={{ position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)', width: '90%', zIndex: 1 }}>
          <Autocomplete
            onLoad={onAutocompleteLoad}
            onPlaceChanged={onPlaceChanged}
          >
            <TextField
              fullWidth
              placeholder="Cari alamat atau nama tempat..."
              variant="outlined"
              sx={{
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                },
              }}
            />
          </Autocomplete>
        </Box>
      )}
      {/* --- Akhir Komponen Pencarian --- */}

      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '300px', borderRadius: '8px' }}
        center={mapCenter}
        zoom={markerPosition ? 15 : 11}
        onClick={handleMapClick}
        onLoad={setMap} // <-- Simpan instance peta saat load
        options={{
          fullscreenControl: false,
          streetViewControl: false,
          mapTypeControl: false,
          zoomControl: false, // Sembunyikan kontrol zoom agar lebih bersih
        }}
      >
        {markerPosition && <MarkerF position={markerPosition} />}
      </GoogleMap>
    </Box>
  )
}