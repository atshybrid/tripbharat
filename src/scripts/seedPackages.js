/**
 * Seed Top South India Tour Packages
 * Run: node src/scripts/seedPackages.js
 */

require('dotenv').config();

const packages = [
  // ─────────────────────────────────────────────────────────────
  // 1. KERALA PREMIUM — Most selling
  // ─────────────────────────────────────────────────────────────
  {
    name: 'Kerala Premium — Munnar, Alleppey & Kochi',
    destination: 'Kerala',
    description: `Experience the best of God's Own Country! This premium 5-day Kerala package covers the misty tea gardens of Munnar, wildlife sanctuaries of Thekkady, and the iconic backwater houseboat stay in Alleppey. End your journey with a cultural exploration of historic Kochi. Perfect for couples and families seeking nature, serenity, and unforgettable experiences.`,
    duration: 5,
    price: 28000,
    discountPrice: 22999,
    category: 'nature',
    difficulty: 'easy',
    maxGroupSize: 20,
    isFeatured: true,
    isActive: true,
    averageRating: 4.8,
    totalReviews: 324,
    images: [
      'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800',
      'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=800',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
      'https://images.unsplash.com/photo-1548013146-72479768bada?w=800'
    ],
    highlights: [
      'Alleppey houseboat overnight stay',
      'Munnar tea garden tour',
      'Thekkady wildlife & spice plantation',
      'Kochi Fort & Chinese fishing nets',
      'Kathakali cultural show'
    ],
    inclusions: [
      'AC accommodation (4 nights)',
      'Daily breakfast & dinner',
      'Houseboat stay with all meals',
      'Private AC vehicle',
      'All sightseeing as per itinerary',
      'Experienced tour guide',
      'GST included'
    ],
    exclusions: [
      'Airfare / train fare',
      'Lunch (except houseboat)',
      'Personal expenses',
      'Entry tickets to monuments',
      'Adventure activities'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Kochi Arrival → Munnar Transfer',
        description: 'Arrive at Kochi Airport / Railway Station. Meet our representative and drive to Munnar (130 km / 4 hrs). Check in to hotel. Evening visit Blossom Hydel Park. Overnight in Munnar.',
        activities: ['Airport pickup', 'Scenic drive through Aluva', 'Blossom Hydel Park visit'],
        meals: 'Dinner',
        accommodation: '3-star hotel, Munnar',
        estimatedCost: 4000
      },
      {
        day: 2,
        title: 'Munnar Sightseeing',
        description: 'Full day Munnar sightseeing — visit Mattupetty Dam, Echo Point, Top Station, Eravikulam National Park (Nilgiri Tahr), and lush tea plantations. Evening at leisure.',
        activities: ['Mattupetty Dam boat ride', 'Echo Point', 'Top Station viewpoint', 'Eravikulam NP', 'Tea plantation walk'],
        meals: 'Breakfast & Dinner',
        accommodation: '3-star hotel, Munnar',
        estimatedCost: 5500
      },
      {
        day: 3,
        title: 'Munnar → Thekkady',
        description: 'Morning drive to Thekkady (90 km). Visit Periyar Wildlife Sanctuary boat ride, spice plantation tour. Evening Kalari martial arts / cultural show.',
        activities: ['Periyar lake boat safari', 'Cardamom spice plantation', 'Elephant interaction', 'Cultural show'],
        meals: 'Breakfast & Dinner',
        accommodation: '3-star resort, Thekkady',
        estimatedCost: 5500
      },
      {
        day: 4,
        title: 'Thekkady → Alleppey Houseboat',
        description: 'Drive to Alleppey (140 km). Board your premium houseboat at noon. Cruise through scenic Kerala backwaters — lush paddy fields, coconut groves, village life. Overnight on houseboat.',
        activities: ['Backwater cruise', 'Village walk on shore', 'Sunset viewing from boat', 'Traditional Kerala dinner on houseboat'],
        meals: 'All meals on houseboat',
        accommodation: 'Premium houseboat, Alleppey backwaters',
        estimatedCost: 7000
      },
      {
        day: 5,
        title: 'Alleppey → Kochi → Departure',
        description: 'Morning check out from houseboat. Drive to Kochi (55 km). Visit Fort Kochi — Chinese fishing nets, Dutch Palace, Jewish Synagogue, Spice Market. Transfer to airport/station.',
        activities: ['Fort Kochi walk', 'Chinese fishing nets', 'Dutch Palace', 'Jew Town & Spice Market'],
        meals: 'Breakfast',
        accommodation: 'Check-out',
        estimatedCost: 3000
      }
    ],
    startDates: [
      new Date('2026-05-01'), new Date('2026-05-15'), new Date('2026-06-01'),
      new Date('2026-06-15'), new Date('2026-07-01'), new Date('2026-08-01'),
      new Date('2026-09-01'), new Date('2026-10-01'), new Date('2026-11-01'),
      new Date('2026-12-01'), new Date('2026-12-20')
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // 2. OOTY–COORG–MYSORE — Top Karnataka Circuit
  // ─────────────────────────────────────────────────────────────
  {
    name: 'Ooty, Coorg & Mysore — Hills & Heritage Circuit',
    destination: 'Karnataka & Tamil Nadu',
    description: `Explore the best of South India's hills and heritage! Visit the royal city of Mysore with its grand palace, trek through the misty Nilgiris of Ooty, and experience the Scotland of India — Coorg — with its lush coffee plantations and waterfalls. Ideal for budget travelers and families looking for a perfect blend of nature and culture.`,
    duration: 6,
    price: 24000,
    discountPrice: 18999,
    category: 'adventure',
    difficulty: 'easy',
    maxGroupSize: 25,
    isFeatured: true,
    isActive: true,
    averageRating: 4.6,
    totalReviews: 218,
    images: [
      'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=800',
      'https://images.unsplash.com/photo-1571104508999-893933ded431?w=800',
      'https://images.unsplash.com/photo-1592549585866-486f411b2d8d?w=800',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'
    ],
    highlights: [
      'Mysore Palace light show (Sunday)',
      'Ooty toy train ride',
      'Coorg coffee plantation stay',
      'Abbey Falls & Raja\'s Seat',
      'Nagarhole wildlife safari option'
    ],
    inclusions: [
      'AC accommodation (5 nights)',
      'Daily breakfast',
      'Private AC vehicle throughout',
      'All transfers & sightseeing',
      'Toy train tickets (Ooty)',
      'Licensed guide'
    ],
    exclusions: [
      'Travel to Bangalore',
      'Lunch & dinner',
      'Entry tickets',
      'Personal expenses',
      'Tips & gratuities'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Bangalore → Mysore',
        description: 'Pick up from Bangalore (140 km / 3 hrs). Check in to hotel. Evening visit Mysore Palace illumination (if Sunday). Chamundi Hill darshan.',
        activities: ['Mysore Palace visit', 'Chamundi Hill', 'Devaraja Market'],
        meals: 'Dinner',
        accommodation: '3-star hotel, Mysore',
        estimatedCost: 3500
      },
      {
        day: 2,
        title: 'Mysore Full Day Sightseeing',
        description: 'Full Mysore city tour — Mysore Zoo, Brindavan Gardens (evening fountain show), Jaganmohan Palace Art Gallery, St. Philomena\'s Church.',
        activities: ['Mysore Zoo', 'Brindavan Gardens fountain show', 'Jaganmohan Palace', 'Shopping at silk emporium'],
        meals: 'Breakfast',
        accommodation: '3-star hotel, Mysore',
        estimatedCost: 4000
      },
      {
        day: 3,
        title: 'Mysore → Ooty (via Bandipur)',
        description: 'Scenic drive through Bandipur Tiger Reserve (wildlife sighting possible). Arrive Ooty. Check in. Evening at Ooty Lake, Botanical Gardens.',
        activities: ['Bandipur wildlife drive', 'Ooty Botanical Gardens', 'Ooty Lake boating'],
        meals: 'Breakfast',
        accommodation: '3-star hotel, Ooty',
        estimatedCost: 4500
      },
      {
        day: 4,
        title: 'Ooty Local Sightseeing',
        description: 'Morning Nilgiri Mountain Railway (toy train) ride. Doddabetta Peak (highest in Nilgiris), Rose Garden, Thread Garden, Tea Museum.',
        activities: ['Toy train ride', 'Doddabetta Peak', 'Rose Garden', 'Tea Museum'],
        meals: 'Breakfast',
        accommodation: '3-star hotel, Ooty',
        estimatedCost: 4000
      },
      {
        day: 5,
        title: 'Ooty → Coorg (Madikeri)',
        description: 'Drive to Coorg (140 km). Visit Abbey Falls, Dubare Elephant Camp, Raja\'s Seat sunset point. Evening coffee plantation walk.',
        activities: ['Abbey Falls', 'Dubare Elephant Camp', 'Raja\'s Seat', 'Coffee plantation tour'],
        meals: 'Breakfast',
        accommodation: 'Coorg homestay / resort',
        estimatedCost: 5000
      },
      {
        day: 6,
        title: 'Coorg → Bangalore Departure',
        description: 'Morning visit Namdroling Monastery (Golden Temple), Iruppu Falls. Drive back to Bangalore (250 km). Drop at airport/station.',
        activities: ['Namdroling Monastery', 'Iruppu Falls', 'Local spice shopping'],
        meals: 'Breakfast',
        accommodation: 'Check-out',
        estimatedCost: 3000
      }
    ],
    startDates: [
      new Date('2026-05-10'), new Date('2026-06-05'), new Date('2026-07-10'),
      new Date('2026-08-15'), new Date('2026-09-05'), new Date('2026-10-10'),
      new Date('2026-11-05'), new Date('2026-12-10')
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // 3. SOUTH INDIA TEMPLE TOUR — Mass audience, year-round
  // ─────────────────────────────────────────────────────────────
  {
    name: 'South India Temple Circuit — Tirupati, Madurai, Rameshwaram & Kanyakumari',
    destination: 'Tamil Nadu & Andhra Pradesh',
    description: `Embark on a sacred pilgrimage across South India's most revered temples. Visit the richest temple in the world — Tirumala Tirupati Balaji, the magnificent Meenakshi Amman in Madurai, the holy Ramanathaswamy temple at Rameshwaram, and witness the divine sunrise at Kanyakumari where three seas meet. A spiritually fulfilling journey for devotees of all ages.`,
    duration: 5,
    price: 18000,
    discountPrice: 14999,
    category: 'pilgrimage',
    difficulty: 'easy',
    maxGroupSize: 30,
    isFeatured: true,
    isActive: true,
    averageRating: 4.7,
    totalReviews: 412,
    images: [
      'https://images.unsplash.com/photo-1624461050280-7ed62ce49c71?w=800',
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800',
      'https://images.unsplash.com/photo-1603871165848-0aa92c869fa1?w=800',
      'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800'
    ],
    highlights: [
      'Tirumala Tirupati Balaji darshan (VIP/Special Entry)',
      'Meenakshi Amman Temple, Madurai',
      'Ramanathaswamy Temple — 22 holy wells',
      'Kanyakumari sunrise & sunset',
      'Vivekananda Rock Memorial'
    ],
    inclusions: [
      'AC accommodation (4 nights)',
      'Daily breakfast & dinner',
      'AC Volvo / luxury bus',
      'VIP darshan at Tirupati',
      'All temple entry & pooja',
      'Expert pilgrim guide'
    ],
    exclusions: [
      'Travel to Tirupati',
      'Prasadam & personal offerings',
      'Lunch',
      'Camera fees at temples',
      'Personal shopping'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Tirupati — Sri Venkateswara Darshan',
        description: 'Arrive at Tirupati. Check in and rest. Evening head to Tirumala (18 km uphill). Special / VIP darshan of Lord Venkateswara. Return to hotel. Laddu prasadam collection.',
        activities: ['Tirumala ghat road drive', 'VIP darshan', 'Laddu prasadam', 'Alipiri footpath (optional)'],
        meals: 'Dinner',
        accommodation: '3-star hotel, Tirupati',
        estimatedCost: 3500
      },
      {
        day: 2,
        title: 'Tirupati → Madurai',
        description: 'Early morning drive to Madurai (430 km / 8 hrs). Check in. Evening visit the illuminated Meenakshi Amman Temple. Watch the spectacular evening abhishekam ceremony.',
        activities: ['Drive through AP & TN landscapes', 'Meenakshi Amman Temple', 'Evening abhishekam'],
        meals: 'Breakfast & Dinner',
        accommodation: '3-star hotel, Madurai',
        estimatedCost: 3500
      },
      {
        day: 3,
        title: 'Madurai → Rameshwaram',
        description: 'Morning visit Thirumalai Nayakkar Palace. Drive to Rameshwaram (175 km) via Pamban Bridge (India\'s first sea bridge). Visit Ramanathaswamy Temple — take holy dip in 22 sacred theerthams.',
        activities: ['Thirumalai Nayakkar Palace', 'Pamban Bridge photo stop', 'Ramanathaswamy Temple', '22 wells sacred bath'],
        meals: 'Breakfast & Dinner',
        accommodation: '3-star hotel, Rameshwaram',
        estimatedCost: 3500
      },
      {
        day: 4,
        title: 'Rameshwaram → Kanyakumari',
        description: 'Morning visit Dhanushkodi (tip of India). Drive to Kanyakumari (320 km). Evening: witness the magical sunset where Arabian Sea, Bay of Bengal & Indian Ocean meet. Visit Vivekananda Rock Memorial.',
        activities: ['Dhanushkodi ruins', 'Kothandaramar Temple', 'Kanyakumari beach sunset', 'Vivekananda Rock Memorial'],
        meals: 'Breakfast & Dinner',
        accommodation: '3-star hotel, Kanyakumari',
        estimatedCost: 4000
      },
      {
        day: 5,
        title: 'Kanyakumari Sunrise → Departure',
        description: 'Early morning 5 AM — witness the breathtaking sunrise (unique — sun rises from the sea). Visit Bhagavathy Amman Temple, Thiruvalluvar Statue. Departure transfer.',
        activities: ['Sunrise at confluence of 3 seas', 'Bhagavathy Amman Temple', 'Thiruvalluvar Statue ferry', 'Local souvenir shopping'],
        meals: 'Breakfast',
        accommodation: 'Check-out',
        estimatedCost: 2500
      }
    ],
    startDates: [
      new Date('2026-05-01'), new Date('2026-05-20'), new Date('2026-06-10'),
      new Date('2026-07-05'), new Date('2026-08-10'), new Date('2026-09-10'),
      new Date('2026-10-05'), new Date('2026-11-01'), new Date('2026-12-05'),
      new Date('2026-12-25')
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // 4. GOA + GOKARNA — Beach & Party (Youth audience)
  // ─────────────────────────────────────────────────────────────
  {
    name: 'Goa & Gokarna Beach Escape — Sun, Sand & Serenity',
    destination: 'Goa & Karnataka',
    description: `The ultimate beach getaway for the young and free! Experience the vibrant nightlife of North Goa, the serene beaches of South Goa, and the unspoiled paradise of Gokarna — one of India's most beautiful and offbeat beaches. Perfect for friend groups, solo travelers, and couples looking for a fun-filled beach vacation with water sports and great food.`,
    duration: 4,
    price: 16000,
    discountPrice: 12999,
    category: 'beach',
    difficulty: 'easy',
    maxGroupSize: 20,
    isFeatured: false,
    isActive: true,
    averageRating: 4.5,
    totalReviews: 187,
    images: [
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      'https://images.unsplash.com/photo-1544550581-5f7ceaf7f992?w=800'
    ],
    highlights: [
      'North Goa beach hopping — Baga, Calangute, Anjuna',
      'Water sports: parasailing, jet ski, banana boat',
      'South Goa — Palolem & Agonda (peaceful beaches)',
      'Gokarna — Om Beach & Half Moon Beach trek',
      'Dudhsagar Waterfall (seasonal)'
    ],
    inclusions: [
      'AC accommodation (3 nights)',
      'Daily breakfast',
      'Airport/station transfers',
      'North Goa sightseeing',
      'Gokarna day trip',
      'Travel insurance'
    ],
    exclusions: [
      'Airfare / train to Goa',
      'Water sports (optional, on cost)',
      'Lunch & dinner',
      'Alcohol',
      'Personal expenses'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Goa Arrival — North Goa Beach Vibes',
        description: 'Arrive at Goa Airport / Madgaon station. Check in. Evening — North Goa beach tour: Baga, Calangute, Anjuna. Sunset at Chapora Fort (from Dil Chahta Hai!). Night: Tito\'s Lane / Club scene (optional).',
        activities: ['Baga Beach', 'Calangute Beach', 'Chapora Fort sunset', 'Anjuna flea market (Wed)', 'Nightlife exploration'],
        meals: 'Welcome dinner',
        accommodation: 'Beach resort / hostel, North Goa',
        estimatedCost: 3500
      },
      {
        day: 2,
        title: 'North Goa Water Sports & Cruise',
        description: 'Morning: water sports at Baga/Calangute — parasailing, jet ski, banana boat, scuba snorkeling. Afternoon: Old Goa churches (UNESCO) — Se Cathedral, Basilica of Bom Jesus. Sunset Mandovi River cruise.',
        activities: ['Parasailing', 'Jet skiing', 'Banana boat ride', 'Old Goa churches', 'Sunset cruise with music & drinks'],
        meals: 'Breakfast',
        accommodation: 'Beach resort, North Goa',
        estimatedCost: 5000
      },
      {
        day: 3,
        title: 'South Goa → Gokarna',
        description: 'Morning: South Goa — Palolem Beach (most beautiful), Agonda Beach (peaceful). Drive to Gokarna (130 km). Evening: Om Beach sunset. Bonfire on beach.',
        activities: ['Palolem Beach', 'Agonda Beach', 'Om Beach Gokarna', 'Half Moon Beach trek', 'Beach bonfire'],
        meals: 'Breakfast',
        accommodation: 'Beach hut / resort, Gokarna',
        estimatedCost: 4500
      },
      {
        day: 4,
        title: 'Gokarna → Departure',
        description: 'Early morning: Paradise Beach (accessible only by boat/trek — most secluded). Visit Mahabaleshwara Temple (ancient Shiva temple). Return to Goa for departure. Drop at airport/station.',
        activities: ['Paradise Beach boat trip', 'Mahabaleshwara Temple', 'Local seafood breakfast', 'Departure transfer'],
        meals: 'Breakfast',
        accommodation: 'Check-out',
        estimatedCost: 3000
      }
    ],
    startDates: [
      new Date('2026-05-01'), new Date('2026-06-01'), new Date('2026-10-15'),
      new Date('2026-11-01'), new Date('2026-11-20'), new Date('2026-12-10'),
      new Date('2026-12-22'), new Date('2026-12-28')
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // 5. COMPLETE SOUTH INDIA — Premium Long Trip
  // ─────────────────────────────────────────────────────────────
  {
    name: 'Complete South India Grand Tour — 9 Days',
    destination: 'Tamil Nadu, Kerala & Karnataka',
    description: `The ultimate South India experience! This premium 9-day tour covers the best of all three states — the French charm of Pondicherry, the temple city of Madurai, the backwaters of Kerala, the hill stations of Munnar, and the royal heritage of Mysore. Perfect for premium travelers and NRIs who want to experience the complete beauty of South India in one seamless journey.`,
    duration: 9,
    price: 65000,
    discountPrice: 52999,
    category: 'cultural',
    difficulty: 'moderate',
    maxGroupSize: 15,
    isFeatured: true,
    isActive: true,
    averageRating: 4.9,
    totalReviews: 98,
    images: [
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800',
      'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800',
      'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=800',
      'https://images.unsplash.com/photo-1571104508999-893933ded431?w=800',
      'https://images.unsplash.com/photo-1624461050280-7ed62ce49c71?w=800'
    ],
    highlights: [
      'Chennai Marina Beach — world\'s 2nd longest beach',
      'Pondicherry — French Quarter & Auroville',
      'Meenakshi Temple & Madurai cultural tour',
      'Alleppey houseboat backwater cruise',
      'Munnar tea gardens & Eravikulam NP',
      'Mysore Palace & Brindavan Gardens',
      'All 4-star hotels throughout'
    ],
    inclusions: [
      '4-star AC accommodation (8 nights)',
      'Daily breakfast & dinner',
      'Luxury AC vehicle throughout',
      'Houseboat (1 night, all meals)',
      'All sightseeing & transfers',
      'Professional guide (English/Hindi/Telugu)',
      'Entrance fees for all monuments',
      'Travel insurance'
    ],
    exclusions: [
      'Airfare (Chennai arrival / Bangalore departure)',
      'Lunch',
      'Personal expenses',
      'Ayurvedic spa & massage (available on cost)',
      'Adventure add-ons'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Chennai — Gateway of South India',
        description: 'Arrive Chennai. Check in to 4-star hotel. Afternoon: Marina Beach (world\'s 2nd longest), Kapaleeshwarar Temple, San Thome Cathedral. Evening: South Indian filter coffee experience.',
        activities: ['Marina Beach walk', 'Kapaleeshwarar Temple', 'San Thome Cathedral', 'Mylapore cultural walk'],
        meals: 'Welcome dinner',
        accommodation: '4-star hotel, Chennai',
        estimatedCost: 7000
      },
      {
        day: 2,
        title: 'Chennai → Pondicherry',
        description: 'Drive to Pondicherry (160 km). Check in. Explore the French Quarter — Promenade Beach, French War Memorial, Alliance Française. Visit Sri Aurobindo Ashram, Auroville Matrimandir.',
        activities: ['French Quarter walk', 'Sri Aurobindo Ashram', 'Auroville Matrimandir', 'Promenade Beach sunset'],
        meals: 'Breakfast & Dinner',
        accommodation: '4-star heritage hotel, Pondicherry',
        estimatedCost: 8000
      },
      {
        day: 3,
        title: 'Pondicherry → Madurai',
        description: 'Drive to Madurai (380 km). En route visit Chidambaram Nataraja Temple. Arrive Madurai. Evening: Meenakshi Amman Temple — awe-inspiring Dravidian architecture. Night: evening aarti.',
        activities: ['Chidambaram Nataraja Temple', 'Meenakshi Amman Temple', 'Evening aarti ceremony'],
        meals: 'Breakfast & Dinner',
        accommodation: '4-star hotel, Madurai',
        estimatedCost: 8000
      },
      {
        day: 4,
        title: 'Madurai → Munnar',
        description: 'Morning: Thirumalai Nayakkar Palace. Drive to Munnar (200 km / 5 hrs). En route: Theni spice market. Arrive Munnar. Check in. Evening: tea estate sunset view.',
        activities: ['Thirumalai Nayakkar Palace', 'Scenic Western Ghats drive', 'Tea estate walk', 'Munnar sunset viewpoint'],
        meals: 'Breakfast & Dinner',
        accommodation: '4-star tea estate resort, Munnar',
        estimatedCost: 9000
      },
      {
        day: 5,
        title: 'Munnar & Thekkady',
        description: 'Morning: Eravikulam National Park (Nilgiri Tahr), Mattupetty Dam, Top Station. Drive to Thekkady. Periyar lake boat safari. Spice plantation — cardamom, pepper, cinnamon.',
        activities: ['Eravikulam NP', 'Mattupetty Dam', 'Top Station', 'Periyar boat safari', 'Spice plantation'],
        meals: 'Breakfast & Dinner',
        accommodation: '4-star resort, Thekkady',
        estimatedCost: 9000
      },
      {
        day: 6,
        title: 'Thekkady → Alleppey Houseboat',
        description: 'Drive to Alleppey (140 km). Board premium houseboat. Overnight backwater cruise through lush Kerala countryside. Watch village life from the water. Sunset on the backwaters.',
        activities: ['Backwater cruise all day', 'Village walk stops', 'Fishing with locals', 'Sunset & sunrise on backwaters'],
        meals: 'All meals on houseboat',
        accommodation: 'Premium houseboat, Kerala backwaters',
        estimatedCost: 10000
      },
      {
        day: 7,
        title: 'Alleppey → Kochi → Mysore',
        description: 'Morning: Fort Kochi walk — Chinese fishing nets, Dutch Palace. Drive to Mysore (350 km). Evening: Mysore Palace illumination (if Sunday) or Chamundi Hill.',
        activities: ['Fort Kochi walk', 'Chinese fishing nets', 'Dutch Palace', 'Chamundi Hill, Mysore'],
        meals: 'Breakfast & Dinner',
        accommodation: '4-star heritage hotel, Mysore',
        estimatedCost: 9000
      },
      {
        day: 8,
        title: 'Mysore Full Day',
        description: 'Full day Mysore: Mysore Palace (grandest in India), Mysore Zoo, Brindavan Gardens (evening illuminated fountain show), Mysore silk & sandalwood shopping.',
        activities: ['Mysore Palace guided tour', 'Mysore Zoo', 'Brindavan Gardens fountain show', 'Silk & sandalwood shopping'],
        meals: 'Breakfast & Dinner',
        accommodation: '4-star heritage hotel, Mysore',
        estimatedCost: 8000
      },
      {
        day: 9,
        title: 'Mysore → Bangalore — Departure',
        description: 'Morning: Somnathpur Hoysala Temple (UNESCO). Drive to Bangalore (140 km). City tour option: Lalbagh, Vidhana Soudha, MG Road shopping. Departure transfer.',
        activities: ['Somnathpur Hoysala Temple', 'Bangalore city tour (optional)', 'MG Road shopping', 'Departure transfer'],
        meals: 'Breakfast',
        accommodation: 'Check-out',
        estimatedCost: 6000
      }
    ],
    startDates: [
      new Date('2026-05-15'), new Date('2026-06-15'), new Date('2026-09-15'),
      new Date('2026-10-10'), new Date('2026-11-10'), new Date('2026-12-15')
    ]
  }
];

async function seedPackages() {
  const { connectPostgreSQL } = require('../config/postgresql');
  const { initModels } = require('../models/postgres');

  try {
    console.log('Connecting to PostgreSQL...');
    const sequelize = await connectPostgreSQL();
    const { TourPackage } = initModels();
    await sequelize.sync({ alter: true });
    console.log('Connected!\n');

    let created = 0;
    let skipped = 0;

    for (const pkg of packages) {
      const existing = await TourPackage.findOne({ where: { name: pkg.name } });
      if (existing) {
        console.log(`⏭  Skipping (already exists): ${pkg.name}`);
        skipped++;
        continue;
      }
      await TourPackage.create(pkg);
      console.log(`✅ Created: ${pkg.name}`);
      created++;
    }

    console.log(`\n📦 Packages seed complete!`);
    console.log(`   Created : ${created}`);
    console.log(`   Skipped : ${skipped}`);
    console.log(`   Total   : ${packages.length}`);

  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

seedPackages();
