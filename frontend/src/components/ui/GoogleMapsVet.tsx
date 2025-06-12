// frontend/src/components/ui/GoogleMapsVet.tsx
"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { IconMapPin, IconPhone, IconClock, IconStar, IconNavigation, IconRefresh } from '@tabler/icons-react';

// Types
interface VetService {
    id: string;
    name: string;
    address: string;
    phone: string;
    rating: number;
    totalReviews: number;
    openHours: string;
    isOpenNow: boolean;
    position: [number, number];
    googleMapUrl: string;
    distance?: number;
    types: string[];
    priceLevel?: number;
    photoUrl?: string;
}

interface UserLocation {
    lat: number;
    lng: number;
}

interface GoogleMapsVetProps {
    apiKey: string;
    center?: { lat: number; lng: number };
    zoom?: number;
    onLocationUpdate?: (location: UserLocation) => void;
}

const containerStyle = {
    width: '100%',
    height: '500px'
};

const defaultCenter = {
    lat: 5.5577, // Default ke Banda Aceh
    lng: 95.3220
};

// Google Maps Libraries needed for Places API
const libraries: ("places")[] = ["places"];

export default function GoogleMapsVet({
    apiKey,
    center = defaultCenter,
    zoom = 12,
    onLocationUpdate
}: GoogleMapsVetProps) {
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [placesService, setPlacesService] = useState<google.maps.places.PlacesService | null>(null);
    const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
    const [vetServices, setVetServices] = useState<VetService[]>([]);
    const [selectedVet, setSelectedVet] = useState<VetService | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchRadius, setSearchRadius] = useState(5000); // meters for Places API
    const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
    const [customIcons, setCustomIcons] = useState<{
        userIcon: google.maps.Icon | null;
        vetIcon: google.maps.Icon | null;
    }>({ userIcon: null, vetIcon: null });

    const mapRef = useRef<google.maps.Map | null>(null);

    // Create custom icons with PurrPal logo
    const createCustomIcons = useCallback(() => {
        if (typeof window !== 'undefined' && window.google && window.google.maps) {
            const userIcon: google.maps.Icon = {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="18" cy="18" r="15" fill="#3B82F6" stroke="#ffffff" stroke-width="3"/>
            <circle cx="18" cy="18" r="6" fill="#ffffff"/>
            <circle cx="18" cy="18" r="3" fill="#3B82F6"/>
            <text x="18" y="32" text-anchor="middle" fill="#3B82F6" font-size="8" font-weight="bold">YOU</text>
          </svg>
        `),
                scaledSize: new window.google.maps.Size(36, 36),
                anchor: new window.google.maps.Point(18, 18)
            };

            // PurrPal Logo Vet Icon
            const vetIcon: google.maps.Icon = {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- Main Circle -->
            <circle cx="22" cy="22" r="18" fill="#FF823C" stroke="#ffffff" stroke-width="3"/>
            
            <!-- PurrPal Cat Face -->
            <g transform="translate(22, 22)">
              <!-- Cat Head -->
              <circle cx="0" cy="-2" r="10" fill="#ffffff"/>
              
              <!-- Cat Ears -->
              <path d="M-7 -8 L-4 -12 L-2 -8 Z" fill="#ffffff"/>
              <path d="M2 -8 L4 -12 L7 -8 Z" fill="#ffffff"/>
              <path d="M-6 -8 L-4.5 -10 L-3 -8 Z" fill="#FF823C"/>
              <path d="M3 -8 L4.5 -10 L6 -8 Z" fill="#FF823C"/>
              
              <!-- Cat Eyes -->
              <circle cx="-3" cy="-4" r="1.5" fill="#2D3748"/>
              <circle cx="3" cy="-4" r="1.5" fill="#2D3748"/>
              <circle cx="-2.5" cy="-4.5" r="0.5" fill="#ffffff"/>
              <circle cx="3.5" cy="-4.5" r="0.5" fill="#ffffff"/>
              
              <!-- Cat Nose -->
              <path d="M0 -1 L-1 1 L1 1 Z" fill="#FF823C"/>
              
              <!-- Cat Mouth -->
              <path d="M0 1 Q-2 3 -3 2" stroke="#2D3748" stroke-width="1" fill="none" stroke-linecap="round"/>
              <path d="M0 1 Q2 3 3 2" stroke="#2D3748" stroke-width="1" fill="none" stroke-linecap="round"/>
              
              <!-- Whiskers -->
              <line x1="-6" y1="-1" x2="-9" y2="-2" stroke="#2D3748" stroke-width="1"/>
              <line x1="-6" y1="1" x2="-9" y2="1" stroke="#2D3748" stroke-width="1"/>
              <line x1="6" y1="-1" x2="9" y2="-2" stroke="#2D3748" stroke-width="1"/>
              <line x1="6" y1="1" x2="9" y2="1" stroke="#2D3748" stroke-width="1"/>
            </g>
            
            <!-- Medical Cross -->
            <g transform="translate(22, 32)">
              <rect x="-1.5" y="-4" width="3" height="8" fill="#ffffff" rx="1"/>
              <rect x="-4" y="-1.5" width="8" height="3" fill="#ffffff" rx="1"/>
            </g>
          </svg>
        `),
                scaledSize: new window.google.maps.Size(44, 44),
                anchor: new window.google.maps.Point(22, 22)
            };

            setCustomIcons({ userIcon, vetIcon });
        }
    }, []);

    // Calculate distance between two coordinates
    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    // Process PlaceResult safely (Fixed deprecated open_now)
    const processPlaceResult = (place: google.maps.places.PlaceResult, userLocation: UserLocation): VetService | null => {
        // Validate required fields
        if (!place.place_id || !place.geometry?.location) {
            return null;
        }

        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const distance = calculateDistance(userLocation.lat, userLocation.lng, lat, lng);

        // Get photo URL if available
        let photoUrl: string | undefined;
        if (place.photos && place.photos.length > 0) {
            try {
                photoUrl = place.photos[0].getUrl({ maxWidth: 300, maxHeight: 200 });
            } catch (error) {
                console.warn('Failed to get photo URL:', error);
            }
        }

        // Get opening hours safely (without deprecated open_now)
        let openHours = 'Hours not available';
        let isOpenNow = false; // ✅ Default to false

        if (place.opening_hours) {
            // Use weekday_text if available
            if (place.opening_hours.weekday_text && place.opening_hours.weekday_text.length > 0) {
                const today = new Date().getDay();
                openHours = place.opening_hours.weekday_text[today] || place.opening_hours.weekday_text[0];
            }

            // ✅ Explicit boolean conversion
            isOpenNow = Boolean(place.opening_hours.periods && place.opening_hours.periods.length > 0);
        }

        return {
            id: place.place_id,
            name: place.name || 'Unknown Vet',
            address: place.formatted_address || place.vicinity || 'Address not available',
            phone: place.formatted_phone_number || 'Phone not available',
            rating: place.rating || 0,
            totalReviews: place.user_ratings_total || 0,
            openHours: openHours,
            isOpenNow: isOpenNow, // ✅ Now always boolean, never undefined
            position: [lat, lng] as [number, number],
            googleMapUrl: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
            distance: Math.round(distance * 100) / 100,
            types: place.types || [],
            priceLevel: place.price_level,
            photoUrl
        };
    };

    const getPlaceDetails = useCallback((placeId: string) => {
        if (!placesService) return;

        const request = {
            placeId: placeId,
            fields: ['opening_hours', 'formatted_phone_number', 'website']
        };

        placesService.getDetails(request, (place, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && place && place.opening_hours) {
                try {
                    // Use the correct isOpen() method and ensure it returns boolean
                    const isCurrentlyOpen = place.opening_hours.isOpen ? place.opening_hours.isOpen() : false;

                    // Update vet with detailed info
                    setVetServices(prevVets =>
                        prevVets.map(v => {
                            if (v.id === placeId) {
                                return {
                                    ...v,
                                    phone: place.formatted_phone_number || v.phone,
                                    isOpenNow: Boolean(isCurrentlyOpen), // ✅ Explicit boolean conversion
                                    openHours: place.opening_hours?.weekday_text?.[new Date().getDay()] || v.openHours
                                };
                            }
                            return v;
                        })
                    );
                } catch (error) {
                    console.warn('Error getting place details for', placeId, ':', error);
                    // ✅ Set default values on error
                    setVetServices(prevVets =>
                        prevVets.map(v => {
                            if (v.id === placeId) {
                                return {
                                    ...v,
                                    isOpenNow: false // ✅ Always boolean
                                };
                            }
                            return v;
                        })
                    );
                }
            }
        });
    }, [placesService]);

    // Search veterinary services using Google Places API
    const searchVeterinaryServices = useCallback((location: UserLocation) => {
        if (!placesService || !map) {
            console.log('❌ Places service or map not ready');
            return;
        }

        setIsLoading(true);
        setError(null);
        console.log('🔍 Searching veterinary services near:', location, 'radius:', searchRadius);

        const request = {
            location: new google.maps.LatLng(location.lat, location.lng),
            radius: searchRadius,
            keyword: 'veterinary clinic pet care animal hospital dokter hewan'
        };

        placesService.nearbySearch(request, (results, status) => {
            console.log('📦 Places API Response:', { status, results });

            if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                const vets: VetService[] = results
                    .map(place => processPlaceResult(place, location))
                    .filter((vet): vet is VetService => vet !== null)
                    .sort((a, b) => (a.distance || 0) - (b.distance || 0)); // Sort by distance

                setVetServices(vets);
                console.log('✅ Found veterinary services:', vets.length);

                // Get detailed info for each place (including accurate open/closed status)
                // Stagger requests to avoid rate limiting
                vets.forEach((vet, index) => {
                    setTimeout(() => {
                        getPlaceDetails(vet.id);
                    }, 200 * index); // 200ms delay between requests
                });

                if (vets.length === 0) {
                    setError('No veterinary services found in this area. Try increasing the search radius.');
                }
            } else {
                console.error('❌ Places API error:', status);
                let errorMessage = 'Failed to search veterinary services';

                switch (status) {
                    case google.maps.places.PlacesServiceStatus.ZERO_RESULTS:
                        errorMessage = 'No veterinary services found in this area. Try increasing the search radius.';
                        break;
                    case google.maps.places.PlacesServiceStatus.OVER_QUERY_LIMIT:
                        errorMessage = 'Search quota exceeded. Please try again later.';
                        break;
                    case google.maps.places.PlacesServiceStatus.REQUEST_DENIED:
                        errorMessage = 'Places API access denied. Please check your API key permissions and billing setup.';
                        break;
                    case google.maps.places.PlacesServiceStatus.INVALID_REQUEST:
                        errorMessage = 'Invalid search request. Please try a different location.';
                        break;
                    default:
                        errorMessage = `Search failed: ${status}`;
                }

                setError(errorMessage);
                setVetServices([]);
            }
            setIsLoading(false);
        });
    }, [placesService, map, searchRadius, getPlaceDetails]);

    // Get user's current location
    const getCurrentLocation = useCallback(() => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by this browser.');
            return;
        }

        setIsLoading(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const location = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                console.log('📍 User location detected:', location);
                setUserLocation(location);
                onLocationUpdate?.(location);

                // Center map to user location
                if (mapRef.current) {
                    mapRef.current.panTo(location);
                    mapRef.current.setZoom(14);
                }

                // Search nearby vet services
                searchVeterinaryServices(location);
            },
            (error) => {
                console.error('❌ Error getting location:', error);
                setError('Unable to get your location. Please allow location access.');
                setIsLoading(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 300000 // 5 minutes
            }
        );
    }, [onLocationUpdate, searchVeterinaryServices]);

    // Initialize map and places service
    const onLoad = useCallback((map: google.maps.Map) => {
        mapRef.current = map;
        setMap(map);

        // Initialize Places Service
        const service = new google.maps.places.PlacesService(map);
        setPlacesService(service);
        console.log('✅ Google Maps and Places Service initialized');
    }, []);

    const onUnmount = useCallback(() => {
        mapRef.current = null;
        setMap(null);
        setPlacesService(null);
        setIsGoogleMapsLoaded(false);
        setCustomIcons({ userIcon: null, vetIcon: null });
    }, []);

    // Handle Google Maps script load
    const handleGoogleMapsLoad = useCallback(() => {
        setIsGoogleMapsLoaded(true);
        console.log('✅ Google Maps loaded successfully');
        setTimeout(() => {
            createCustomIcons();
        }, 200);
    }, [createCustomIcons]);

    // Handle radius change
    const handleRadiusChange = (newRadius: number) => {
        setSearchRadius(newRadius);
        if (userLocation) {
            searchVeterinaryServices(userLocation);
        }
    };

    // Search around a specific location
    const searchAroundLocation = (location: UserLocation) => {
        setUserLocation(location);
        if (mapRef.current) {
            mapRef.current.panTo(location);
            mapRef.current.setZoom(14);
        }
        searchVeterinaryServices(location);
    };

    // Get icons with fallback
    const getUserIcon = () => customIcons.userIcon || { url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' };
    const getVetIcon = () => customIcons.vetIcon || { url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png' };

    return (
        <div className="w-full space-y-4">
            {/* Controls */}
            <div className="flex flex-wrap gap-4 items-center justify-between bg-white p-4 rounded-lg shadow-sm border">
                <div className="flex gap-2">
                    <button
                        onClick={getCurrentLocation}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
                    >
                        <IconNavigation className="w-4 h-4" />
                        {isLoading ? 'Getting Location...' : 'Find Nearby Vets'}
                    </button>

                    {userLocation && (
                        <button
                            onClick={() => searchVeterinaryServices(userLocation)}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 transition-colors"
                        >
                            <IconRefresh className="w-4 h-4" />
                            Refresh
                        </button>
                    )}

                    {userLocation && (
                        <select
                            value={searchRadius}
                            onChange={(e) => handleRadiusChange(Number(e.target.value))}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value={2000}>Within 2 km</option>
                            <option value={5000}>Within 5 km</option>
                            <option value={10000}>Within 10 km</option>
                            <option value={15000}>Within 15 km</option>
                            <option value={20000}>Within 20 km</option>
                        </select>
                    )}
                </div>

                <div className="text-sm text-gray-600">
                    {userLocation && (
                        <span>📍 Your location: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}</span>
                    )}
                    {vetServices.length > 0 && (
                        <span className="ml-4">🏥 {vetServices.length} vet services found</span>
                    )}
                    {isGoogleMapsLoaded && (
                        <span className="ml-2 text-green-600">✓ Google Places API ready</span>
                    )}
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    <p className="font-medium">❌ {error}</p>
                    {error.includes('REQUEST_DENIED') && (
                        <div className="mt-2 text-sm">
                            <p><strong>Troubleshooting tips:</strong></p>
                            <ul className="list-disc list-inside mt-1 space-y-1">
                                <li>Enable "Places API" (not "Places API New") in Google Cloud Console</li>
                                <li>Setup billing account - Places API requires payment method</li>
                                <li>Check API key restrictions include Places API</li>
                                <li>Wait 5-10 minutes for changes to propagate</li>
                            </ul>
                        </div>
                    )}
                </div>
            )}

            {/* Google Map */}
            <div className="rounded-lg overflow-hidden shadow-lg border">
                <LoadScript
                    googleMapsApiKey={apiKey}
                    libraries={libraries}
                    onLoad={handleGoogleMapsLoad}
                    onError={(error) => {
                        console.error('Google Maps loading error:', error);
                        setError('Failed to load Google Maps. Please check your API key and ensure Places API is enabled.');
                    }}
                    loadingElement={
                        <div className="h-[500px] flex items-center justify-center bg-gray-100">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                                <p className="text-gray-600">Loading Google Maps...</p>
                                <p className="text-sm text-gray-500 mt-2">Initializing Places API...</p>
                            </div>
                        </div>
                    }
                >
                    <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={userLocation || center}
                        zoom={zoom}
                        onLoad={onLoad}
                        onUnmount={onUnmount}
                        onClick={(e) => {
                            if (e.latLng) {
                                const lat = e.latLng.lat();
                                const lng = e.latLng.lng();
                                searchAroundLocation({ lat, lng });
                            }
                        }}
                        options={{
                            zoomControl: true,
                            streetViewControl: false,
                            mapTypeControl: false,
                            fullscreenControl: true,
                        }}
                    >
                        {/* User Location Marker */}
                        {userLocation && isGoogleMapsLoaded && (
                            <Marker
                                position={userLocation}
                                title="Your Current Location"
                                icon={getUserIcon()}
                                zIndex={1000}
                            />
                        )}

                        {/* Vet Service Markers */}
                        {isGoogleMapsLoaded && vetServices.map((vet) => (
                            <Marker
                                key={vet.id}
                                position={{ lat: vet.position[0], lng: vet.position[1] }}
                                title={vet.name}
                                icon={getVetIcon()}
                                onClick={() => setSelectedVet(vet)}
                                zIndex={500}
                            />
                        ))}

                        {/* Info Window */}
                        {selectedVet && isGoogleMapsLoaded && (
                            <InfoWindow
                                position={{ lat: selectedVet.position[0], lng: selectedVet.position[1] }}
                                onCloseClick={() => setSelectedVet(null)}
                                options={{
                                    pixelOffset: new window.google.maps.Size(0, -44)
                                }}
                            >
                                <div className="p-3 max-w-sm">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-orange-500 text-lg">🐱</span>
                                        <h3 className="font-semibold text-lg text-gray-800">
                                            {selectedVet.name}
                                        </h3>
                                        {selectedVet.isOpenNow && (
                                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                                Open Now
                                            </span>
                                        )}
                                    </div>

                                    {selectedVet.photoUrl && (
                                        <img
                                            src={selectedVet.photoUrl}
                                            alt={selectedVet.name}
                                            className="w-full h-24 object-cover rounded mb-2"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = 'none';
                                            }}
                                        />
                                    )}

                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-start gap-2">
                                            <IconMapPin className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-600">{selectedVet.address}</span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <IconPhone className="w-4 h-4 text-green-500" />
                                            <span className="text-gray-600">{selectedVet.phone}</span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <IconClock className="w-4 h-4 text-blue-500" />
                                            <span className="text-gray-600">{selectedVet.openHours}</span>
                                        </div>

                                        {selectedVet.rating > 0 && (
                                            <div className="flex items-center gap-2">
                                                <IconStar className="w-4 h-4 text-yellow-500" />
                                                <span className="text-gray-600">
                                                    {selectedVet.rating.toFixed(1)} ({selectedVet.totalReviews} reviews)
                                                </span>
                                            </div>
                                        )}

                                        {selectedVet.distance && (
                                            <div className="text-orange-600 font-medium">
                                                📍 {selectedVet.distance} km from your location
                                            </div>
                                        )}

                                        <div className="pt-2">
                                            <a
                                                href={selectedVet.googleMapUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-orange-500 hover:text-orange-600 text-sm font-medium"
                                            >
                                                🗺️ View on Google Maps
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </InfoWindow>
                        )}
                    </GoogleMap>
                </LoadScript>
            </div>

            {/* Vet List */}
            {vetServices.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border">
                    <div className="p-4 border-b">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                            <span className="text-orange-500">🐱</span>
                            Nearby Veterinary Services
                            <span className="text-sm font-normal text-gray-500">({vetServices.length} found via Google Places)</span>
                        </h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                        {vetServices.map((vet) => (
                            <div
                                key={vet.id}
                                className="p-4 border-b last:border-b-0 hover:bg-orange-50 cursor-pointer transition-colors"
                                onClick={() => {
                                    setSelectedVet(vet);
                                    if (mapRef.current) {
                                        mapRef.current.panTo({ lat: vet.position[0], lng: vet.position[1] });
                                        mapRef.current.setZoom(16);
                                    }
                                }}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-orange-500">🏥</span>
                                        <h4 className="font-medium text-gray-800">{vet.name}</h4>
                                        {vet.isOpenNow && (
                                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                                Open
                                            </span>
                                        )}
                                    </div>
                                    {vet.distance && (
                                        <span className="text-sm text-orange-600 font-medium">
                                            {vet.distance} km
                                        </span>
                                    )}
                                </div>

                                <p className="text-sm text-gray-600 mb-1">{vet.address}</p>

                                <div className="flex items-center gap-4 text-sm">
                                    {vet.rating > 0 && (
                                        <span className="flex items-center gap-1">
                                            <IconStar className="w-4 h-4 text-yellow-500" />
                                            {vet.rating.toFixed(1)} ({vet.totalReviews})
                                        </span>
                                    )}
                                    <span className="text-gray-500">{vet.openHours}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Instructions */}
            <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-lg p-4 border border-orange-200">
                <h4 className="font-medium text-gray-800 mb-2">💡 Tips:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Click "Find Nearby Vets" to get real-time vet data from Google Places</li>
                    <li>• Click anywhere on the map to search for vets in that area</li>
                    <li>• All data is live from Google Maps (hours, ratings, photos)</li>
                    <li>• Green "Open" badges show currently open veterinary services</li>
                </ul>
            </div>
        </div>
    );
}