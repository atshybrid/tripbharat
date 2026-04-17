const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SK ToursiQ API Documentation',
      version: '1.0.0',
      description: 'Complete REST API documentation for SK ToursiQ Travel Booking Platform',
      contact: {
        name: 'SK ToursiQ',
        email: 'support@sktours.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://168.144.93.18/api',
        description: 'Production server (IP direct)'
      },
      {
        url: 'http://api.tripbharatgo.com/api',
        description: 'Production server (domain)'
      },
      {
        url: 'https://api.tripbharatgo.com/api',
        description: 'Production server (HTTPS — after SSL)'
      },
      {
        url: 'http://localhost:5000/api',
        description: 'Local development'
      }
    ],
    externalDocs: {
      description: 'API Documentation',
      url: 'http://api.tripbharatgo.com/api/docs'
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token obtained from login/signup'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            phone: { type: 'string', example: '9876543210' },
            profileImage: { type: 'string', format: 'uri' },
            role: { type: 'string', enum: ['user', 'admin'], default: 'user' },
            walletBalance: { type: 'number', format: 'decimal', example: 1000.50 },
            referralCode: { type: 'string', example: 'ABC123XYZ' },
            isActive: { type: 'boolean', default: true },
            isEmailVerified: { type: 'boolean', default: false },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        TourPackage: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string', example: 'Goa Beach Paradise' },
            destination: { type: 'string', example: 'Goa, India' },
            description: { type: 'string' },
            duration: { type: 'integer', example: 5 },
            price: { type: 'number', format: 'decimal', example: 15000 },
            discountPrice: { type: 'number', format: 'decimal', example: 12000 },
            images: { type: 'array', items: { type: 'string', format: 'uri' } },
            maxGroupSize: { type: 'integer', example: 10 },
            difficulty: { type: 'string', enum: ['easy', 'moderate', 'difficult'] },
            category: { type: 'string', example: 'Beach' },
            inclusions: { type: 'array', items: { type: 'string' } },
            exclusions: { type: 'array', items: { type: 'string' } },
            itinerary: { type: 'array', items: { type: 'object' } },
            averageRating: { type: 'number', format: 'decimal', example: 4.5 },
            totalReviews: { type: 'integer', example: 120 },
            isActive: { type: 'boolean', default: true },
            isFeatured: { type: 'boolean', default: false }
          }
        },
        Booking: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            bookingNumber: { type: 'string', example: 'TRV20261A2B3C4D' },
            userId: { type: 'string', format: 'uuid' },
            packageId: { type: 'string', format: 'uuid' },
            packageName: { type: 'string' },
            numberOfTravelers: { type: 'integer', example: 2 },
            travelers: { type: 'array', items: { type: 'object' } },
            startDate: { type: 'string', format: 'date' },
            endDate: { type: 'string', format: 'date' },
            totalAmount: { type: 'number', format: 'decimal', example: 24000 },
            gstAmount: { type: 'number', format: 'decimal', example: 2880 },
            finalAmount: { type: 'number', format: 'decimal', example: 26880 },
            paymentMethod: { type: 'string', enum: ['wallet', 'razorpay', 'partial'] },
            paymentStatus: { type: 'string', enum: ['pending', 'completed', 'failed', 'refunded'] },
            bookingStatus: { type: 'string', enum: ['confirmed', 'pending', 'cancelled', 'completed'] }
          }
        },
        WalletTransaction: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            userId: { type: 'string', format: 'uuid' },
            type: { type: 'string', enum: ['credit', 'debit'] },
            amount: { type: 'number', format: 'decimal', example: 500 },
            balanceAfter: { type: 'number', format: 'decimal', example: 1500 },
            description: { type: 'string', example: 'Added money to wallet' },
            source: { type: 'string', enum: ['razorpay', 'refund', 'referral', 'booking', 'admin'] },
            status: { type: 'string', enum: ['pending', 'completed', 'failed'] },
            razorpayOrderId: { type: 'string' },
            razorpayPaymentId: { type: 'string' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Error message' },
            errors: { type: 'array', items: { type: 'object' } }
          }
        },
        Success: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string' },
            data: { type: 'object' }
          }
        }
      },
      responses: {
        UnauthorizedError: {
          description: 'Access token is missing or invalid',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' }
            }
          }
        },
        ValidationError: {
          description: 'Validation error',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' }
            }
          }
        },
        NotFoundError: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' }
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ],
    tags: [
      { name: 'Authentication', description: 'User authentication endpoints' },
      { name: 'Packages', description: 'Tour package management' },
      { name: 'Bookings', description: 'Booking management' },
      { name: 'Wallet', description: 'Wallet and transactions' },
      { name: 'Payments', description: 'Payment processing with Razorpay' },
      { name: 'Get-Together', description: 'Group trip planning' },
      { name: 'Referrals', description: 'Referral system' },
      { name: 'Admin', description: 'Admin operations' }
    ]
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
