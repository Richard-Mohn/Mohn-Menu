'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

/* ─── Types ────────────────────────────────────────────────── */

export interface ParsedAddress {
  /** Full formatted address from Google Places */
  formatted: string;
  street: string;        // e.g. "123 Main St"
  city: string;
  state: string;         // 2-letter code
  zipCode: string;
  country: string;       // 2-letter code
  lat: number;
  lng: number;
}

interface AddressAutocompleteProps {
  /** Current address text value */
  value: string;
  /** Called whenever the text input changes */
  onChange: (value: string) => void;
  /** Called when a user selects a suggestion — delivers structured address data */
  onSelect?: (address: ParsedAddress) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  className?: string;
  inputClassName?: string;
  /** Restrict suggestions to a specific country (ISO 3166-1 alpha-2). Default: US */
  country?: string;
  /** Disable the autocomplete dropdown (renders as a plain input) */
  disabled?: boolean;
}

/* ─── Google Maps script loader ────────────────────────────── */

let scriptLoaded = false;
let scriptLoading = false;
const loadCallbacks: (() => void)[] = [];

function loadGoogleMapsScript(): Promise<void> {
  return new Promise((resolve) => {
    if (scriptLoaded && window.google?.maps?.places) {
      resolve();
      return;
    }

    loadCallbacks.push(resolve);

    if (scriptLoading) return;
    scriptLoading = true;

    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!key) {
      console.warn('[AddressAutocomplete] NEXT_PUBLIC_GOOGLE_MAPS_API_KEY not set — autocomplete disabled');
      scriptLoading = false;
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places&callback=__mohnGoogleMapsInit`;
    script.async = true;
    script.defer = true;

    (window as any).__mohnGoogleMapsInit = () => {
      scriptLoaded = true;
      scriptLoading = false;
      loadCallbacks.forEach((cb) => cb());
      loadCallbacks.length = 0;
      delete (window as any).__mohnGoogleMapsInit;
    };

    script.onerror = () => {
      console.error('[AddressAutocomplete] Failed to load Google Maps script');
      scriptLoading = false;
      resolve();
    };

    document.head.appendChild(script);
  });
}

/* ─── Parse place_id into structured address ───────────────── */

function parsePlaceResult(place: google.maps.places.PlaceResult): ParsedAddress {
  const components = place.address_components || [];
  const get = (type: string, short = false) =>
    components.find((c) => c.types.includes(type))?.[short ? 'short_name' : 'long_name'] || '';

  const streetNumber = get('street_number');
  const streetName = get('route');
  const street = [streetNumber, streetName].filter(Boolean).join(' ');

  return {
    formatted: place.formatted_address || '',
    street,
    city: get('locality') || get('sublocality_level_1') || get('administrative_area_level_2'),
    state: get('administrative_area_level_1', true),
    zipCode: get('postal_code'),
    country: get('country', true),
    lat: place.geometry?.location?.lat() || 0,
    lng: place.geometry?.location?.lng() || 0,
  };
}

/* ─── Component ────────────────────────────────────────────── */

export default function AddressAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder = 'Start typing an address…',
  label,
  required,
  className = '',
  inputClassName = '',
  country = 'us',
  disabled = false,
}: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [ready, setReady] = useState(false);

  const handlePlaceChanged = useCallback(() => {
    const ac = autocompleteRef.current;
    if (!ac) return;
    const place = ac.getPlace();
    if (!place?.geometry) return;

    const parsed = parsePlaceResult(place);
    onChange(parsed.formatted);
    onSelect?.(parsed);
  }, [onChange, onSelect]);

  useEffect(() => {
    if (disabled) return;

    let cancelled = false;

    loadGoogleMapsScript().then(() => {
      if (cancelled || !inputRef.current || !window.google?.maps?.places) return;

      const ac = new google.maps.places.Autocomplete(inputRef.current, {
        types: ['address'],
        componentRestrictions: { country },
        fields: ['address_components', 'formatted_address', 'geometry'],
      });

      ac.addListener('place_changed', handlePlaceChanged);
      autocompleteRef.current = ac;
      setReady(true);
    });

    return () => {
      cancelled = true;
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
        autocompleteRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled, country]);

  const baseInput =
    'w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all';

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium mb-1.5">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`${baseInput} ${inputClassName}`}
          autoComplete="off"
        />
        {!disabled && ready && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="w-4 h-4 text-zinc-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
