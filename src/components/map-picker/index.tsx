import React from 'react'
import { Box } from '@mui/material'

// Impor komponen dari react-leaflet
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet'

// Impor untuk fungsionalitas pencarian
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch'

// Jangan lupa impor CSS Leaflet dan Geosearch
import 'leaflet/dist/leaflet.css'
import 'leaflet-geosearch/dist/geosearch.css'

// Perbaikan untuk ikon marker default di Leaflet dengan webpack
import L from 'leaflet'
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
})

// Tipe props tidak berubah
interface MapPickerProps {
  value?: number[]
  onChange: (coords: number[]) => void
  disabled?: boolean
}

// Posisi default di Jakarta
const defaultCenter: L.LatLngExpression = [-6.2088, 106.8456]

// Komponen helper untuk pencarian
const SearchField = ({ onChange, disabled }: { onChange: (coords: number[]) => void, disabled?: boolean }) => {
  const map = useMap()

  React.useEffect(() => {
    if (disabled) return

    const provider = new OpenStreetMapProvider()

    // @ts-expect-error - leaflet-geosearch terkadang punya masalah tipe dengan React
    const searchControl = new GeoSearchControl({
      provider: provider,
      style: 'bar', // Tampilan search bar
      showMarker: true,
      marker: {
        icon: new L.Icon.Default(),
        draggable: false,
      },
      autoClose: true,
      keepResult: true,
      searchLabel: 'Cari alamat atau tempat...',
    })

    map.addControl(searchControl)

    // Listener saat lokasi ditemukan
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onLocationFound = (e: any) => {
      // Koordinat dari hasil pencarian (y = lat, x = lng)
      onChange([e.location.y, e.location.x])
    }
    map.on('geosearch/showlocation', onLocationFound)

    // Cleanup saat komponen unmount
    return () => {
      map.removeControl(searchControl)
      map.off('geosearch/showlocation', onLocationFound)
    }
  }, [map, onChange, disabled])

  return null // Komponen ini tidak me-render apapun, hanya menambahkan kontrol ke peta
}


// Komponen helper untuk menangani event di peta
const MapEvents = ({ onChange, disabled }: { onChange: (coords: number[]) => void; disabled?: boolean }) => {
  useMapEvents({
    click(e) {
      if (!disabled) {
        onChange([e.latlng.lat, e.latlng.lng])
      }
    },
  })
  return null
}

// Komponen helper untuk menggeser peta saat nilai berubah
const RecenterAutomatically = ({ position }: { position: L.LatLngExpression }) => {
  const map = useMap()
  React.useEffect(() => {
    map.flyTo(position, 15)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [position])
  return null
}

export default function MapPicker({ value, onChange, disabled }: MapPickerProps) {
  const markerPosition: L.LatLngExpression | undefined =
    value && value.length === 2 ? [value[0], value[1]] : undefined

  const mapCenter = markerPosition || defaultCenter

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '300px' }}>
      <MapContainer
        center={mapCenter}
        zoom={markerPosition ? 15 : 11}
        style={{ height: '100%', width: '100%', borderRadius: '8px' }}
        scrollWheelZoom={true}
      >
        {/* Lapisan peta dari OpenStreetMap */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Marker yang akan ditampilkan */}
        {markerPosition && <Marker position={markerPosition} />}

        {/* Komponen untuk logika */}
        <MapEvents onChange={onChange} disabled={disabled} />
        {!disabled && <SearchField onChange={onChange} disabled={disabled} />}
        {markerPosition && <RecenterAutomatically position={markerPosition} />}

      </MapContainer>
    </Box>
  )
}