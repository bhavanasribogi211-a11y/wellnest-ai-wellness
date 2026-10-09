import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldAlert,
  MapPin,
  Phone,
  PhoneCall,
  Clock,
  Building2,
  Calendar,
  CheckCircle2,
  Navigation,
  Car,
  X,
  Share2,
  UserCheck,
  AlertTriangle,
  Stethoscope,
  TestTube,
  Check,
  ArrowRight,
  Filter,
} from 'lucide-react';
import {
  HOSPITALS_DATA,
  LABORATORIES_DATA,
  RIDE_OPTIONS,
} from '../data/initialData';
import { Hospital, Laboratory, Doctor, LabTest, RideOption } from '../types';

export const EmergencySosScreen: React.FC = () => {
  const {
    userProfile,
    updateUserProfile,
    bookAppointment,
    bookLabTest,
    bookRide,
    activeRide,
    cancelRide,
    appointments,
    labBookings,
    showToast,
    setCurrentScreen,
  } = useApp();

  // Step 1: Location & Emergency Details state
  const [area, setArea] = useState(userProfile.location?.area || 'Indiranagar 100ft Road');
  const [address, setAddress] = useState(userProfile.location?.fullAddress || 'Flat 402, Green Orchid, Indiranagar');
  const [pincode, setPincode] = useState(userProfile.location?.pincode || '560038');
  const [contactNumber, setContactNumber] = useState('9876543210');
  const [locationConsent, setLocationConsent] = useState(true);
  const [emergencyType, setEmergencyType] = useState('Severe Menstrual Cramps / Fainting');
  const [isGpsActive, setIsGpsActive] = useState(userProfile.location?.isDetected || false);

  // Tabs: Hospitals vs Labs
  const [facilityTab, setFacilityTab] = useState<'hospitals' | 'labs'>('hospitals');
  const [serviceFilter, setServiceFilter] = useState<'all' | '24x7' | 'gyn'>('all');

  // Modals / Drawers
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string>('Today, 10:30 AM');
  const [isAppointmentConfirmed, setIsAppointmentConfirmed] = useState(false);

  // Lab modal
  const [selectedLab, setSelectedLab] = useState<Laboratory | null>(null);
  const [selectedTests, setSelectedTests] = useState<LabTest[]>([]);
  const [isHomeCollection, setIsHomeCollection] = useState(true);
  const [selectedLabSlot, setSelectedLabSlot] = useState<string>('Tomorrow, 08:30 AM');
  const [isLabConfirmed, setIsLabConfirmed] = useState(false);

  // Ride Booking
  const [selectedRideOption, setSelectedRideOption] = useState<RideOption>(RIDE_OPTIONS[2]); // Cab by default
  const [isRideModalOpen, setIsRideModalOpen] = useState(false);

  // Emergency Actions Modals
  const [isFamilyContactModalOpen, setIsFamilyContactModalOpen] = useState(false);
  const [familyPhone, setFamilyPhone] = useState('+91 98450 12345');

  // Detect GPS
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser', 'warning');
      return;
    }
    showToast('Detecting current GPS location...', 'info');
    navigator.geolocation.getCurrentPosition(
      pos => {
        setIsGpsActive(true);
        updateUserProfile({
          location: {
            ...userProfile.location,
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            isDetected: true,
          },
        });
        showToast('GPS location attached to Emergency SOS!', 'success');
      },
      err => {
        showToast('Location permission unavailable. Manual entry is active.', 'info');
      }
    );
  };

  const filteredHospitals = HOSPITALS_DATA.filter(h => {
    if (serviceFilter === '24x7') return h.open24x7;
    if (serviceFilter === 'gyn') return h.services.some(s => s.toLowerCase().includes('gynecology'));
    return true;
  });

  const handleConfirmAppointment = () => {
    if (!selectedHospital || !selectedDoctor) return;
    bookAppointment({
      hospitalName: selectedHospital.name,
      doctorName: selectedDoctor.name,
      doctorSpecialty: selectedDoctor.specialty,
      date: selectedSlot.split(',')[0],
      slot: selectedSlot.split(',')[1] || selectedSlot,
      patientName: userProfile.name || 'Patient',
      consultationFee: selectedDoctor.consultationFee,
    });
    setIsAppointmentConfirmed(true);
  };

  const handleConfirmLabBooking = () => {
    if (!selectedLab || selectedTests.length === 0) return;
    const total = selectedTests.reduce((sum, t) => sum + t.price, 0);
    bookLabTest({
      labName: selectedLab.name,
      testNames: selectedTests.map(t => t.name),
      date: selectedLabSlot.split(',')[0],
      timeSlot: selectedLabSlot.split(',')[1] || selectedLabSlot,
      patientName: userProfile.name || 'Patient',
      homeCollection: isHomeCollection,
      totalPrice: total,
    });
    setIsLabConfirmed(true);
  };

  const handleBookRide = () => {
    const driverNames = ['Ramesh Kumar', 'Suresh Gowda', 'Anand Verma'];
    const plates = ['KA 03 AB 4589', 'KA 05 MN 9012', 'KA 01 XY 7721'];
    const rnd = Math.floor(Math.random() * 3);

    bookRide({
      rideType: selectedRideOption.type,
      driverName: selectedRideOption.isEmergencyAmbulance ? 'Paramedic Unit #4' : driverNames[rnd],
      driverPhone: '+91 99801 55432',
      vehicleNumber: plates[rnd],
      otp: Math.floor(1000 + Math.random() * 9000).toString(),
      etaMinutes: selectedRideOption.etaMinutes,
      price: selectedRideOption.price,
      pickupAddress: address,
      hospitalName: selectedHospital ? selectedHospital.name : 'Manipal Hospital & Women Care',
    });
    setIsRideModalOpen(false);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] pb-24 pt-4 px-4 max-w-6xl mx-auto space-y-6">
      {/* Top Emergency SOS Alert Banner */}
      <div className="bg-gradient-to-r from-rose-600 via-red-600 to-pink-700 text-white p-6 sm:p-8 rounded-3xl shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold tracking-wide uppercase mb-2">
              <ShieldAlert className="w-3.5 h-3.5 text-white animate-pulse" />
              <span>SC4 • Emergency SOS, Care Directory & Medical Rides</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading">
              Immediate Care & Emergency Assistance
            </h1>
            <p className="text-xs sm:text-sm text-rose-100 max-w-xl mt-1 leading-relaxed">
              Find nearest verified hospitals, book instant priority doctor consultations, schedule home sample tests, and hail simulated transit.
            </p>
          </div>

          {/* Quick SOS Trigger Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <a
              href="tel:112"
              className="px-5 py-3 rounded-2xl bg-white text-rose-700 hover:bg-rose-50 font-black text-sm shadow-xl flex items-center gap-2 transition-transform active:scale-95"
            >
              <PhoneCall className="w-4 h-4 fill-rose-600 animate-bounce" />
              Call 112 (National SOS)
            </a>

            <button
              onClick={() => setIsFamilyContactModalOpen(true)}
              className="px-4 py-3 rounded-2xl bg-rose-800/80 hover:bg-rose-800 text-white font-bold text-xs border border-white/20 flex items-center gap-1.5 transition-all"
            >
              <Share2 className="w-3.5 h-3.5" />
              Alert Family
            </button>
          </div>
        </div>

        {/* Safety Disclaimer */}
        <div className="mt-4 pt-3 border-t border-rose-500/50 text-[11px] text-rose-100 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-300" />
          <span>
            <strong>Safety Notice:</strong> In life-threatening emergencies, call official emergency helpline <strong>112</strong> immediately. This web interface provides real-time facility information and prototype dispatch assistance.
          </span>
        </div>
      </div>

      {/* STEP 1: Location & Emergency Details Card */}
      <div className="bg-white rounded-3xl p-6 border border-rose-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-800 font-heading">
                Step 1: Emergency Location & Triage Reason
              </h2>
              <p className="text-xs text-slate-500">Provide your pickup point to calibrate nearest emergency units</p>
            </div>
          </div>

          <button
            onClick={handleDetectLocation}
            className="px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center gap-1.5 transition-colors active:scale-95"
          >
            <Navigation className="w-3.5 h-3.5" />
            {isGpsActive ? '✓ GPS Attached' : 'Detect My Location'}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Emergency Nature</label>
            <select
              value={emergencyType}
              onChange={e => setEmergencyType(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800 font-medium bg-white"
            >
              <option>Severe Menstrual Cramps / Fainting</option>
              <option>Heavy Menstrual Hemorrhage</option>
              <option>Sudden Unilateral Pelvic Pain</option>
              <option>Severe Allergic / Medication Reaction</option>
              <option>High Fever with Acute Weakness</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Area / Locality</label>
            <input
              type="text"
              value={area}
              onChange={e => setArea(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800 font-medium"
              placeholder="e.g. Indiranagar 100ft Road"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Pincode</label>
            <input
              type="text"
              value={pincode}
              onChange={e => setPincode(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800 font-medium"
              placeholder="e.g. 560038"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 text-xs">
          <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 font-medium">
            <input
              type="checkbox"
              checked={locationConsent}
              onChange={e => setLocationConsent(e.target.checked)}
              className="w-4 h-4 accent-rose-600 rounded-sm"
            />
            <span>I consent to share location data with nearby medical response centers</span>
          </label>

          <button
            onClick={() => showToast(`Calibrated emergency units within 5 km of ${area}!`, 'success')}
            className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-all active:scale-95"
          >
            Find Nearby Help (3 Available)
          </button>
        </div>
      </div>

      {/* STEP 2: Hospitals and Laboratories Tabs */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-800 font-heading">
                Step 2: Medical Facilities Directory
              </h2>
              <p className="text-xs text-slate-500">Choose between Emergency Hospitals or Diagnostic Labs</p>
            </div>
          </div>

          {/* Switcher Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-2xl gap-1">
            <button
              onClick={() => setFacilityTab('hospitals')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                facilityTab === 'hospitals'
                  ? 'bg-white text-purple-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              🏥 Hospitals ({HOSPITALS_DATA.length})
            </button>
            <button
              onClick={() => setFacilityTab('labs')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                facilityTab === 'labs'
                  ? 'bg-white text-purple-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              🔬 Diagnostic Labs ({LABORATORIES_DATA.length})
            </button>
          </div>
        </div>

        {/* Interactive Demo Map Card */}
        <div className="p-4 bg-gradient-to-r from-purple-50 via-pink-50 to-rose-50 rounded-3xl border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-700 bg-white px-2.5 py-0.5 rounded-full border border-purple-200">
              Interactive GPS Healthcare Map (Simulated Live Radar)
            </span>
            <span className="text-xs text-slate-500 font-semibold">Active radius: 5.2 km</span>
          </div>

          {/* Graphical Map Representation */}
          <div className="relative w-full h-44 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 flex items-center justify-center">
            {/* Map Grid Pattern */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#8B5CF6_1px,transparent_1px)] [background-size:16px_16px]" />

            {/* User Pin Center */}
            <div className="absolute z-10 flex flex-col items-center animate-bounce">
              <span className="text-xl">📍</span>
              <span className="text-[10px] font-bold bg-slate-900 text-white px-1.5 py-0.5 rounded-md shadow-xs">
                You ({area.split(' ')[0]})
              </span>
            </div>

            {/* Hospital Pins */}
            <button
              onClick={() => setSelectedHospital(HOSPITALS_DATA[0])}
              className="absolute top-8 left-16 z-10 flex flex-col items-center hover:scale-110 transition-transform"
            >
              <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center text-sm shadow-md ring-2 ring-white">
                🏥
              </div>
              <span className="text-[9px] font-extrabold bg-white text-slate-800 px-1 rounded-sm shadow-xs mt-0.5">
                Manipal (1.4 km)
              </span>
            </button>

            <button
              onClick={() => setSelectedHospital(HOSPITALS_DATA[1])}
              className="absolute bottom-6 right-20 z-10 flex flex-col items-center hover:scale-110 transition-transform"
            >
              <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm shadow-md ring-2 ring-white">
                🏥
              </div>
              <span className="text-[9px] font-extrabold bg-white text-slate-800 px-1 rounded-sm shadow-xs mt-0.5">
                Cloudnine (2.8 km)
              </span>
            </button>

            <button
              onClick={() => {
                setFacilityTab('labs');
                setSelectedLab(LABORATORIES_DATA[0]);
              }}
              className="absolute top-10 right-28 z-10 flex flex-col items-center hover:scale-110 transition-transform"
            >
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs shadow-md ring-2 ring-white">
                🔬
              </div>
              <span className="text-[9px] font-extrabold bg-white text-slate-800 px-1 rounded-sm shadow-xs mt-0.5">
                Thyrocare (1.2 km)
              </span>
            </button>
          </div>
        </div>

        {/* HOSPITALS VIEW */}
        {facilityTab === 'hospitals' && (
          <div className="space-y-3">
            {/* Filter buttons */}
            <div className="flex gap-2 text-xs">
              <button
                onClick={() => setServiceFilter('all')}
                className={`px-3 py-1 rounded-full border font-semibold ${
                  serviceFilter === 'all' ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-slate-600'
                }`}
              >
                All Hospitals
              </button>
              <button
                onClick={() => setServiceFilter('24x7')}
                className={`px-3 py-1 rounded-full border font-semibold ${
                  serviceFilter === '24x7' ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-slate-600'
                }`}
              >
                24x7 Emergency
              </button>
              <button
                onClick={() => setServiceFilter('gyn')}
                className={`px-3 py-1 rounded-full border font-semibold ${
                  serviceFilter === 'gyn' ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-slate-600'
                }`}
              >
                Gynecology Emergency
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {filteredHospitals.map(hosp => (
                <div
                  key={hosp.id}
                  className="bg-white rounded-3xl border border-slate-100 shadow-2xs hover:shadow-lg hover:border-purple-200 transition-all overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <img
                      src={hosp.image}
                      alt={hosp.name}
                      className="w-full h-36 object-cover"
                    />
                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          {hosp.distanceKm} km away • Open 24x7
                        </span>
                        <span className="text-xs font-bold text-amber-500">★ {hosp.rating}</span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-800 font-heading">
                        {hosp.name}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-1">
                        {hosp.address}
                      </p>

                      <div className="flex flex-wrap gap-1 pt-1">
                        {hosp.services.slice(0, 3).map((s, i) => (
                          <span key={i} className="text-[10px] bg-slate-50 text-slate-600 px-2 py-0.5 rounded-md">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-0 border-t border-slate-50 space-y-2">
                    <div className="flex items-center justify-between text-xs pt-2">
                      <span className="text-slate-500 font-medium">Beds Available:</span>
                      <span className="font-extrabold text-purple-700">{hosp.bedsAvailable} Beds</span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedHospital(hosp);
                          setSelectedDoctor(hosp.doctors[0]);
                          setIsAppointmentConfirmed(false);
                        }}
                        className="flex-1 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition-all active:scale-95"
                      >
                        Doctors & Slots ({hosp.doctors.length})
                      </button>

                      <a
                        href={`tel:${hosp.emergencyPhone}`}
                        className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors"
                        title="Call Emergency Helpline"
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LABS VIEW */}
        {facilityTab === 'labs' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {LABORATORIES_DATA.map(lab => (
              <div
                key={lab.id}
                className="bg-white rounded-3xl border border-slate-100 shadow-2xs hover:shadow-lg p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-extrabold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
                        {lab.distanceKm} km away
                      </span>
                      <h3 className="text-base font-bold text-slate-800 font-heading mt-1">
                        {lab.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">{lab.address}</p>
                    </div>
                    <span className="text-xs font-bold text-amber-500">★ {lab.rating}</span>
                  </div>

                  <div className="mt-3 space-y-1.5 text-xs">
                    <span className="font-bold text-slate-700 block">Available Hormone & Metabolic Panels:</span>
                    {lab.tests.map(t => (
                      <div key={t.id} className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                        <span className="font-medium text-slate-800 truncate pr-2">{t.name}</span>
                        <span className="font-bold text-purple-700 shrink-0">₹{t.price}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-emerald-600 font-bold">
                    ✓ Home Sample Collection Available
                  </span>
                  <button
                    onClick={() => {
                      setSelectedLab(lab);
                      setSelectedTests([lab.tests[0]]);
                      setIsLabConfirmed(false);
                    }}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition-all active:scale-95"
                  >
                    Book Diagnostic Test
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* STEP 3: Simulated Medical Transportation Rides */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center font-bold">
              3
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-800 font-heading">
                Step 3: Transportation & Emergency Transit
              </h2>
              <p className="text-xs text-slate-500">Fastest transit to your nearest hospital</p>
            </div>
          </div>

          <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-bold border border-amber-200">
            Simulated Prototype Dispatch
          </span>
        </div>

        {/* Active Ride Banner if booked */}
        {activeRide && (
          <div className="p-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
                Live {activeRide.rideType} Tracking (Simulated)
              </span>
              <span className="text-sm font-extrabold">OTP: {activeRide.otp}</span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-extrabold font-heading">{activeRide.driverName}</h4>
                <p className="text-xs text-emerald-100">{activeRide.vehicleNumber} • Arriving in {activeRide.etaMinutes} mins</p>
                <p className="text-xs text-emerald-100">Heading to: {activeRide.hospitalName}</p>
              </div>
              <button
                onClick={cancelRide}
                className="px-3 py-1.5 rounded-xl bg-white text-rose-600 hover:bg-rose-50 font-bold text-xs shadow-xs"
              >
                Cancel Ride
              </button>
            </div>
          </div>
        )}

        {/* Ride Options Selection */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {RIDE_OPTIONS.map(opt => {
            const isSelected = selectedRideOption.id === opt.id;
            return (
              <div
                key={opt.id}
                onClick={() => setSelectedRideOption(opt)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-purple-600 bg-purple-50/70 ring-2 ring-purple-300 shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{opt.icon}</span>
                    <span className="text-xs font-extrabold text-slate-800">
                      {opt.price === 0 ? 'FREE' : `₹${opt.price}`}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 mt-2">{opt.type}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{opt.description}</p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-purple-700 font-bold">{opt.etaMinutes} mins ETA</span>
                  {isSelected && <span className="text-xs text-purple-600 font-extrabold">✓</span>}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={() => setIsRideModalOpen(true)}
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 text-white font-bold text-xs shadow-md transition-all active:scale-95 flex items-center gap-2"
          >
            <span>Book Simulated {selectedRideOption.type} (ETA {selectedRideOption.etaMinutes}m)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* RIDE CONFIRMATION MODAL */}
      {isRideModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div onClick={() => setIsRideModalOpen(false)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" />
          <div className="relative bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-purple-100 z-10 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-800 font-heading">
                Confirm Simulated {selectedRideOption.type}
              </h3>
              <button onClick={() => setIsRideModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3">
              <div className="p-3 bg-purple-50 rounded-2xl border border-purple-100 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Pickup Location:</span>
                  <span className="font-bold text-slate-800">{address.slice(0, 30)}...</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Destination:</span>
                  <span className="font-bold text-purple-700">Manipal Hospital Emergency</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Fare:</span>
                  <span className="font-bold text-slate-800">{selectedRideOption.price === 0 ? 'Free Emergency' : `₹${selectedRideOption.price}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">ETA:</span>
                  <span className="font-bold text-slate-800">{selectedRideOption.etaMinutes} Minutes</span>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800">
                <strong>Prototype Simulation:</strong> Real GPS drivers are not dispatched. This validates the emergency transit workflow.
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setIsRideModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleBookRide}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-md"
              >
                Confirm Dispatch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DOCTOR APPOINTMENT MODAL */}
      {selectedHospital && selectedDoctor && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div onClick={() => setSelectedHospital(null)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" />
          <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-purple-100 z-10 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-bold text-purple-700 uppercase">{selectedHospital.name}</span>
              <button onClick={() => setSelectedHospital(null)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {isAppointmentConfirmed ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl animate-bounce">
                  ✓
                </div>
                <h3 className="text-base font-extrabold text-slate-800 font-heading">
                  Appointment Confirmed!
                </h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Your appointment with <strong>{selectedDoctor.name}</strong> is scheduled for <strong>{selectedSlot}</strong> at {selectedHospital.name}.
                </p>
                <div className="pt-3">
                  <button
                    onClick={() => setSelectedHospital(null)}
                    className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-4 space-y-4 max-h-[65vh] overflow-y-auto pr-1">
                {/* Doctor Bio Card */}
                <div className="flex gap-3 items-center p-3 bg-purple-50/50 rounded-2xl border border-purple-100">
                  <img src={selectedDoctor.image} alt={selectedDoctor.name} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm font-heading">{selectedDoctor.name}</h4>
                    <p className="text-purple-700 font-semibold">{selectedDoctor.specialty}</p>
                    <p className="text-slate-500 text-[11px]">{selectedDoctor.experienceYears} Years Exp • ★ {selectedDoctor.rating}</p>
                  </div>
                </div>

                <p className="text-slate-600">{selectedDoctor.about}</p>

                {/* Available Doctors switcher */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Select Doctor at this Hospital:</label>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedHospital.doctors.map(d => (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => setSelectedDoctor(d)}
                        className={`p-2 rounded-xl border text-left ${
                          selectedDoctor.id === d.id ? 'border-purple-600 bg-purple-50 text-purple-700 font-bold' : 'border-slate-200'
                        }`}
                      >
                        <span className="block truncate">{d.name}</span>
                        <span className="text-[10px] text-slate-400">₹{d.consultationFee} Fee</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Select Slot */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Select Consultation Slot:</label>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedDoctor.availability.map(slot => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-2 rounded-xl border font-bold text-center ${
                          selectedSlot === slot ? 'border-purple-600 bg-purple-600 text-white' : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-xs">
                  <span className="text-slate-500">Consultation Fee:</span>
                  <span className="font-extrabold text-slate-900 text-sm">₹{selectedDoctor.consultationFee}</span>
                </div>
              </div>
            )}

            {!isAppointmentConfirmed && (
              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button onClick={() => setSelectedHospital(null)} className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold">
                  Cancel
                </button>
                <button onClick={handleConfirmAppointment} className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-md">
                  Book Slot
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* LAB TEST BOOKING MODAL */}
      {selectedLab && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div onClick={() => setSelectedLab(null)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" />
          <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-purple-100 z-10 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-bold text-purple-700 uppercase">{selectedLab.name}</span>
              <button onClick={() => setSelectedLab(null)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {isLabConfirmed ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl animate-bounce">
                  ✓
                </div>
                <h3 className="text-base font-extrabold text-slate-800 font-heading">
                  Lab Test Confirmed!
                </h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Your appointment at <strong>{selectedLab.name}</strong> is booked for <strong>{selectedLabSlot}</strong>. Phlebotomist assigned.
                </p>
                <div className="pt-3">
                  <button onClick={() => setSelectedLab(null)} className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs">
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-4 space-y-4 max-h-[65vh] overflow-y-auto pr-1">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Select Tests to Include:</label>
                  <div className="space-y-2">
                    {selectedLab.tests.map(t => {
                      const isChecked = selectedTests.some(x => x.id === t.id);
                      return (
                        <div
                          key={t.id}
                          onClick={() => {
                            setSelectedTests(prev =>
                              isChecked ? prev.filter(x => x.id !== t.id) : [...prev, t]
                            );
                          }}
                          className={`p-3 rounded-2xl border cursor-pointer flex items-center justify-between ${
                            isChecked ? 'border-purple-600 bg-purple-50/50' : 'border-slate-200'
                          }`}
                        >
                          <div>
                            <h5 className="font-bold text-slate-800">{t.name}</h5>
                            <p className="text-[11px] text-slate-500 mt-0.5">{t.description}</p>
                          </div>
                          <span className="font-extrabold text-purple-700 shrink-0 ml-2">₹{t.price}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="p-3 bg-purple-50 rounded-2xl border border-purple-100 flex items-center justify-between">
                  <span className="font-bold text-slate-700">Home Sample Collection:</span>
                  <input
                    type="checkbox"
                    checked={isHomeCollection}
                    onChange={e => setIsHomeCollection(e.target.checked)}
                    className="w-4 h-4 accent-purple-600"
                  />
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-xs">
                  <span className="text-slate-500">Total Price:</span>
                  <span className="font-extrabold text-purple-700 text-sm">
                    ₹{selectedTests.reduce((sum, t) => sum + t.price, 0)}
                  </span>
                </div>
              </div>
            )}

            {!isLabConfirmed && (
              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button onClick={() => setSelectedLab(null)} className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold">
                  Cancel
                </button>
                <button
                  onClick={handleConfirmLabBooking}
                  disabled={selectedTests.length === 0}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-md disabled:opacity-40"
                >
                  Confirm Lab Booking
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ALERT FAMILY MODAL */}
      {isFamilyContactModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div onClick={() => setIsFamilyContactModalOpen(false)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" />
          <div className="relative bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-rose-100 z-10 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-800 font-heading">
                Send Emergency SOS to Family Contact
              </h3>
              <button onClick={() => setIsFamilyContactModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Family Emergency Contact</label>
                <input
                  type="text"
                  value={familyPhone}
                  onChange={e => setFamilyPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800 font-medium"
                />
              </div>

              <div className="p-3 bg-rose-50 rounded-2xl border border-rose-100 text-rose-900 space-y-1">
                <strong>Simulated SMS Text:</strong>
                <p className="text-[11px]">
                  "SOS from {userProfile.name}: I need medical support at {address}. WellNest emergency radius active. Calling 112 if required."
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button onClick={() => setIsFamilyContactModalOpen(false)} className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold">
                Cancel
              </button>
              <button
                onClick={() => {
                  showToast(`Emergency SMS dispatched to ${familyPhone}!`, 'success');
                  setIsFamilyContactModalOpen(false);
                }}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-md"
              >
                Send Alert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
