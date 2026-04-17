const AppError = require('../utils/appError');

// Simulated bus routes data (replace with real bus API integration if needed)
const BUS_ROUTES = [
  { id: 'BR001', operator: 'SK Travels', from: 'Hyderabad', to: 'Bangalore', departureTime: '22:00', arrivalTime: '06:00', duration: '8h', price: 650, seatsAvailable: 20, busType: 'AC Sleeper', amenities: ['WiFi', 'Charging Point', 'Water Bottle'] },
  { id: 'BR002', operator: 'Parveen Travels', from: 'Hyderabad', to: 'Chennai', departureTime: '21:00', arrivalTime: '07:00', duration: '10h', price: 750, seatsAvailable: 15, busType: 'AC Semi-Sleeper', amenities: ['Charging Point', 'Blanket'] },
  { id: 'BR003', operator: 'Orange Tours', from: 'Bangalore', to: 'Goa', departureTime: '20:00', arrivalTime: '08:00', duration: '12h', price: 900, seatsAvailable: 30, busType: 'Volvo AC', amenities: ['WiFi', 'Snacks', 'Movie'] },
  { id: 'BR004', operator: 'SK Travels', from: 'Mumbai', to: 'Pune', departureTime: '06:00', arrivalTime: '09:30', duration: '3.5h', price: 300, seatsAvailable: 25, busType: 'AC Seater', amenities: ['Charging Point'] },
  { id: 'BR005', operator: 'APSRTC', from: 'Hyderabad', to: 'Vijayawada', departureTime: '08:00', arrivalTime: '13:00', duration: '5h', price: 400, seatsAvailable: 40, busType: 'Non-AC', amenities: [] },
];

// GET /api/bus/search?from=&to=&date=&passengers=
exports.searchBuses = async (req, res, next) => {
  try {
    const { from, to, date, passengers = 1 } = req.query;
    if (!from || !to) return next(new AppError('From and To locations are required', 400));

    const routes = BUS_ROUTES.filter(r =>
      r.from.toLowerCase().includes(from.toLowerCase()) &&
      r.to.toLowerCase().includes(to.toLowerCase()) &&
      r.seatsAvailable >= parseInt(passengers)
    );

    res.status(200).json({
      success: true,
      data: {
        routes,
        searchParams: { from, to, date, passengers },
        totalResults: routes.length
      }
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/bus/routes/:id
exports.getBusRoute = async (req, res, next) => {
  try {
    const route = BUS_ROUTES.find(r => r.id === req.params.id);
    if (!route) return next(new AppError('Bus route not found', 404));
    res.status(200).json({ success: true, data: route });
  } catch (error) {
    next(error);
  }
};

// POST /api/bus/book
exports.bookBus = async (req, res, next) => {
  try {
    const {
      routeId, travelDate, seatNumbers, boardingPoint, droppingPoint,
      passengerName, passengerEmail, passengerPhone, totalAmount
    } = req.body;

    if (!routeId || !travelDate || !passengerName || !passengerEmail || !passengerPhone) {
      return next(new AppError('routeId, travelDate, passengerName, passengerEmail, passengerPhone are required', 400));
    }

    const route = BUS_ROUTES.find(r => r.id === routeId);
    if (!route) return next(new AppError('Bus route not found', 404));

    const bookingRef = `BUS${Date.now().toString().slice(-8)}`;

    res.status(201).json({
      success: true,
      message: 'Bus booking created successfully',
      data: {
        bookingRef,
        routeId,
        route: { from: route.from, to: route.to, operator: route.operator, busType: route.busType, departureTime: route.departureTime },
        travelDate,
        seatNumbers: seatNumbers || [],
        boardingPoint,
        droppingPoint,
        passenger: { name: passengerName, email: passengerEmail, phone: passengerPhone },
        totalAmount: totalAmount || route.price,
        paymentStatus: 'pending',
        status: 'confirmed',
        bookedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
};
