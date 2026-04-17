const AppError = require('../utils/appError');

const HOTELS = [
  { id: 'H001', name: 'Grand Hyatt', city: 'Hyderabad', address: 'Banjara Hills, Hyderabad', rating: 5, pricePerNight: 8500, amenities: ['Pool', 'Spa', 'Gym', 'Restaurant', 'WiFi', 'Parking'], images: [], roomTypes: [{ type: 'Deluxe', price: 8500, capacity: 2 }, { type: 'Suite', price: 15000, capacity: 4 }] },
  { id: 'H002', name: 'Novotel', city: 'Hyderabad', address: 'HICC Complex, Hyderabad', rating: 4, pricePerNight: 5500, amenities: ['Pool', 'Restaurant', 'WiFi', 'Gym'], images: [], roomTypes: [{ type: 'Standard', price: 5500, capacity: 2 }, { type: 'Deluxe', price: 7500, capacity: 3 }] },
  { id: 'H003', name: 'The Leela Palace', city: 'Bangalore', address: 'Old Airport Road, Bangalore', rating: 5, pricePerNight: 12000, amenities: ['Pool', 'Spa', 'Gym', 'Multiple Restaurants', 'WiFi', 'Concierge'], images: [], roomTypes: [{ type: 'Deluxe', price: 12000, capacity: 2 }, { type: 'Royal Suite', price: 35000, capacity: 4 }] },
  { id: 'H004', name: 'Marriott', city: 'Goa', address: 'Miramar Beach, Goa', rating: 5, pricePerNight: 10000, amenities: ['Beach Access', 'Pool', 'Spa', 'Restaurant', 'WiFi'], images: [], roomTypes: [{ type: 'Sea View', price: 10000, capacity: 2 }, { type: 'Beach Villa', price: 20000, capacity: 4 }] },
  { id: 'H005', name: 'Taj Hotel', city: 'Mumbai', address: 'Colaba, Mumbai', rating: 5, pricePerNight: 15000, amenities: ['Pool', 'Spa', 'Multiple Restaurants', 'WiFi', 'Gym', 'Heritage Tours'], images: [], roomTypes: [{ type: 'Heritage Room', price: 15000, capacity: 2 }, { type: 'Sea Facing Suite', price: 40000, capacity: 4 }] },
  { id: 'H006', name: 'Treebo', city: 'Hyderabad', address: 'Ameerpet, Hyderabad', rating: 3, pricePerNight: 1800, amenities: ['WiFi', 'AC', 'Breakfast'], images: [], roomTypes: [{ type: 'Standard', price: 1800, capacity: 2 }] },
];

// GET /api/hotels/search?city=&checkIn=&checkOut=&guests=&rooms=
exports.searchHotels = async (req, res, next) => {
  try {
    const { city, checkIn, checkOut, guests = 1, rooms = 1, minPrice, maxPrice, rating } = req.query;
    if (!city) return next(new AppError('City is required', 400));

    let hotels = HOTELS.filter(h => h.city.toLowerCase().includes(city.toLowerCase()));

    if (minPrice) hotels = hotels.filter(h => h.pricePerNight >= parseFloat(minPrice));
    if (maxPrice) hotels = hotels.filter(h => h.pricePerNight <= parseFloat(maxPrice));
    if (rating)   hotels = hotels.filter(h => h.rating >= parseInt(rating));

    // Calculate nights
    let nights = 1;
    if (checkIn && checkOut) {
      const diff = new Date(checkOut) - new Date(checkIn);
      nights = Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)));
    }

    const results = hotels.map(h => ({ ...h, totalPrice: h.pricePerNight * nights * parseInt(rooms), nights }));

    res.status(200).json({
      success: true,
      data: { hotels: results, searchParams: { city, checkIn, checkOut, guests, rooms }, totalResults: results.length }
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/hotels/:id
exports.getHotelById = async (req, res, next) => {
  try {
    const hotel = HOTELS.find(h => h.id === req.params.id);
    if (!hotel) return next(new AppError('Hotel not found', 404));
    res.status(200).json({ success: true, data: hotel });
  } catch (error) {
    next(error);
  }
};

// POST /api/hotels/book
exports.bookHotel = async (req, res, next) => {
  try {
    const {
      hotelId, roomType, checkIn, checkOut, guests, rooms,
      guestName, guestEmail, guestPhone, totalAmount, specialRequests
    } = req.body;

    if (!hotelId || !checkIn || !checkOut || !guestName || !guestEmail || !guestPhone) {
      return next(new AppError('hotelId, checkIn, checkOut, guestName, guestEmail, guestPhone are required', 400));
    }

    const hotel = HOTELS.find(h => h.id === hotelId);
    if (!hotel) return next(new AppError('Hotel not found', 404));

    const nights = Math.max(1, Math.round((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)));
    const room = hotel.roomTypes.find(r => r.type === roomType) || hotel.roomTypes[0];
    const bookingRef = `HTL${Date.now().toString().slice(-8)}`;

    res.status(201).json({
      success: true,
      message: 'Hotel booking created successfully',
      data: {
        bookingRef,
        hotelId,
        hotel: { name: hotel.name, city: hotel.city, address: hotel.address, rating: hotel.rating },
        roomType: room?.type,
        checkIn,
        checkOut,
        nights,
        rooms: rooms || 1,
        guests,
        guest: { name: guestName, email: guestEmail, phone: guestPhone },
        specialRequests,
        totalAmount: totalAmount || (room?.price || hotel.pricePerNight) * nights * (rooms || 1),
        paymentStatus: 'pending',
        status: 'confirmed',
        bookedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
};
