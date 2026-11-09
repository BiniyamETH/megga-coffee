/* =====================================================================
   MEGGA MORNING GRACE COFFEE — SITE CONFIG + MENU
   ---------------------------------------------------------------------
   Edit this file to change business info, hours, prices or menu items.
   See README.md for the plain HTML business details to update as well.

   Rules for editing:
   - Keep the quotes "" around text.
   - Keep the comma at the end of each line / item.
   - Prices are plain numbers (no $ sign): 3.95 not "$3.95".
   ===================================================================== */

const SITE = {
  name: "Megga Morning Grace Coffee",
  alternateName: "Megga Coffee",

  // The two lines of the logo in the header and footer.
  logoTop: "MEGGA MORNING GRACE COFFEE",
  logoBottom: "Coffee · Community · Toronto",

  city: "Toronto",
  address: {
    street: "1696 Danforth Ave",
    city: "Toronto",
    region: "ON",
    postalCode: "M4C 1H8",
    country: "CA"
  },
  geo: { lat: 43.6842185, lng: -79.3206684 },

  // Leave "" to hide every phone number and "Call" button on the site.
  // Write it the way you want it shown, e.g. "(647) 575-9431".
  phone: "(647) 575-9431", // from Google Maps listing

  // Shown under "Payments" in the Contact section. Leave [] to hide.
  payments: ["Credit cards", "Debit cards"], // from Google Maps listing

  // Optional. Leave "" to hide. Example: "https://www.instagram.com/meggacoffee"
  instagram: "",

  orderUrl: "https://www.ubereats.com/ca/store/megga-morning-grace-coffee/lcxvV_vkUyulXjWnfndXcA",
  directionsUrl: "https://www.google.com/maps/search/?api=1&query=Megga+coffee+1696+Danforth+Ave+Toronto",
  reviewsUrl: "https://www.google.com/maps/place/Megga+coffee/@43.6842185,-79.3206684,17z/data=!4m6!3m5!1s0x89d4cd0e040bd121:0x5b02da0321c5b6d7!8m2!3d43.6842185!4d-79.3206684!16s%2Fg%2F11z4dqq0qw",
  mapEmbedUrl: "https://maps.google.com/maps?q=Megga%20Coffee%2C%201696%20Danforth%20Ave%2C%20Toronto%2C%20ON%20M4C%201H8&z=16&output=embed",

  // Google rating — update these numbers when your reviews change.
  rating: { value: 5.0, count: 25 },

  // Opening hours, 24-hour clock, Toronto time.
  // To close on a day, write:  sun: null,
  // Matches Google Maps (Nov 2026): 8 a.m.–9 p.m., 7 days a week.
  timezone: "America/Toronto",
  hours: {
    mon: ["08:00", "21:00"],
    tue: ["08:00", "21:00"],
    wed: ["08:00", "21:00"],
    thu: ["08:00", "21:00"],
    fri: ["08:00", "21:00"],
    sat: ["08:00", "21:00"],
    sun: ["08:00", "21:00"]
  },

  // Photos. Put files in the /assets folder and write the path here.
  // Leave src "" to show a warm placeholder instead of a photo.
  images: {
    // Gallery photos are the café's own, from its Google Maps listing ("By owner").
    // preview: true = also shown in the small Gallery box near the top of the homepage (3 photos).
    // home: false = keep it off the homepage photo strip (e.g. it looks too much like the hero photo).
    // The homepage strip also skips any photo that is already shown elsewhere on the homepage.
    // small: a 600px-wide copy used where the photo is shown small (homepage). Optional.
    gallery: [
      { src: "assets/gallery/cafe-interior.jpg", small: "assets/gallery/cafe-interior-600.jpg", alt: "Inside Megga Morning Grace Coffee: pendant lights, framed photos and the coffee bar", caption: "Our café", preview: true },
      { src: "assets/gallery/pastry-case.jpg", small: "assets/gallery/pastry-case-600.jpg", alt: "Croissants, muffins and loaf cakes in the pastry case", caption: "Fresh pastries", preview: true },
      { src: "assets/gallery/megga-cups.jpg", small: "assets/gallery/megga-cups-600.jpg", alt: "Megga Morning Grace Coffee takeaway cups on the counter", caption: "Coffee to go" },
      { src: "assets/gallery/dessert-case.jpg", small: "assets/gallery/dessert-case-600.jpg", alt: "Colourful frozen desserts in the display freezer", caption: "Frozen treats" },
      { src: "assets/gallery/cappuccino.jpg", small: "assets/gallery/cappuccino-600.jpg", alt: "A cappuccino on the counter", caption: "Cappuccino", preview: true },
      { src: "assets/hero.jpg", alt: "Guests chatting over coffee inside Megga Morning Grace Coffee", caption: "Café life", home: false }
    ]
    // Tip: on desktop the first photo is shown large, so 5 or 9 photos fill the grid neatly.
  },

  // The four menu cards on the homepage (and the About page).
  // "category" must match a category id in MENU below. "image" is the card photo.
  highlights: [
    { label: "Coffee",               sub: "Espresso, latte, mocha & more",  category: "specialty-coffees",    image: "assets/cards/coffee.jpg", small: "assets/cards/coffee-600.jpg" },
    { label: "Drinks",               sub: "Juice, tea, hot chocolate & more", category: "drinks",               image: "assets/cards/drinks.jpg", small: "assets/cards/drinks-600.jpg" },
    { label: "Breakfast & Brunch",   sub: "Benedicts, omelettes, pancakes", category: "benedicts",            image: "assets/cards/breakfast.jpg", small: "assets/cards/breakfast-600.jpg" },
    { label: "Sandwiches & Burgers", sub: "Sandwiches, burgers, salads",    category: "breakfast-sandwiches", image: "assets/cards/sandwiches.jpg", small: "assets/cards/sandwiches-600.jpg" }
  ]
};

/* ---------------------------------------------------------------------
   MENU
   Each category can have an image: "assets/menu/<file>.jpg" (or "" for none).
   It is shown at the top of that section on the menu page, cropped to a wide 3:1 strip (960x320 works well).
   Also put a small 96x96 square copy with the same name in assets/menu/small/ for the Sections list.
   Each item: { name: "...", price: 0.00, desc: "optional", tags: [], image: "assets/menu/items/<file>.jpg" }
   Item photos are small squares (240x240) in assets/menu/items/. Leave image out or "" for no photo.
   Tags you can use:  "v" = Vegetarian, "s" = Spicy, "gf" = Gluten Free
   --------------------------------------------------------------------- */

const MENU = [
  {
    id: "specialty-coffees",
    name: "Specialty Coffees",
    image: "assets/menu/specialty-coffees.jpg",
    items: [
      { name: "Single Espresso", price: 3.50, image: "assets/menu/items/espresso-single.jpg" },
      { name: "Double Espresso", price: 4.00, image: "assets/menu/items/espresso-double.jpg" },
      { name: "Espresso Macchiato", price: 3.50 },
      { name: "Cappuccino", price: 4.00, image: "assets/menu/items/cappuccino.jpg" },
      { name: "Americano", price: 4.00, image: "assets/menu/items/americano.jpg" },
      { name: "Red Eye", price: 3.50, image: "assets/menu/items/red-eye.jpg" },
      { name: "Café Latte", price: 4.00, image: "assets/menu/items/cafe-latte.jpg" },
      { name: "Vanilla Latte", price: 4.00 },
      { name: "Caramel Latte", price: 4.00 },
      { name: "Flat White", price: 4.00 },
      { name: "Mocha", price: 5.00, image: "assets/menu/items/cafe-mocha.jpg" },
      { name: "Matcha Latte", price: 5.00 },
      { name: "Regular Coffee", price: 4.00, image: "assets/menu/items/coffee.jpg" }
    ]
  },
  {
    id: "drinks",
    name: "Drinks",
    image: "assets/menu/drinks.jpg",
    items: [
      { name: "Fresh Orange Juice", price: 5.25, image: "assets/menu/items/orange-juice.jpg" },
      { name: "Black Tea", price: 3.00, image: "assets/menu/items/tea.jpg" },
      { name: "Green Tea", price: 3.00 },
      { name: "Chai Tea", price: 3.00 },
      { name: "Hot Chocolate", price: 4.50, image: "assets/menu/items/hot-chocolate.jpg" },
      { name: "Hot Chocolate with Espresso", price: 5.00 },
      { name: "Iced Coffee", price: 5.00 },
      { name: "Iced Latte", price: 5.00 },
      { name: "Iced Espresso", price: 5.00 },
      { name: "Iced Americano", price: 5.00 },
      { name: "Fruit Smoothie (Small)", price: 8.00 },
      { name: "Fruit Smoothie (Large)", price: 10.00 },
      { name: "Bottled Juice", price: 3.50, image: "assets/menu/items/bottled-juice.jpg" },
      { name: "Minute Maid Juice", price: 3.00 },
      { name: "Coca-Cola", price: 3.00 },
      { name: "Canada Dry", price: 3.00 },
      { name: "Bottled Water", price: 2.00, image: "assets/menu/items/bottled-water.jpg" }
    ]
  },
  {
    id: "breakfast-sandwiches",
    name: "Breakfast Sandwiches",
    image: "assets/menu/breakfast-sandwiches.jpg",
    items: [
      { name: "Egg Sandwich", price: 6.00, image: "assets/menu/items/egg-sandwich.jpg" },
      { name: "Egg Sandwich Special", price: 8.00 },
      { name: "Chicken Breast Sandwich", price: 5.50 },
      { name: "Chicken Breast Special", price: 8.00 },
      { name: "Chicken Breast Special", price: 10.00 },
      { name: "Turkey Breast Sandwich", price: 5.50 },
      { name: "Ham Sandwich", price: 5.50 },
      { name: "Turkey Breast Special", price: 8.00 },
      { name: "Turkey Special", price: 10.00 },
      { name: "BLT", price: 8.95, image: "assets/menu/items/blt.jpg" },
      { name: "Single Peameal and Egg", price: 8.95, image: "assets/menu/items/peameal-egg.jpg" },
      { name: "Toasted Western", price: 8.95, image: "assets/menu/items/toasted-western.jpg" },
      { name: "BELT", price: 9.95, image: "assets/menu/items/belt.jpg" },
      { name: "Double Peameal and Cheese", price: 9.95, image: "assets/menu/items/double-peameal-cheese.jpg" },
      { name: "BBLT", price: 10.95, image: "assets/menu/items/bblt.jpg" },
      { name: "TBLT", price: 10.95, image: "assets/menu/items/tblt.jpg" },
      { name: "2 Lil Piggies", price: 12.95, image: "assets/menu/items/2-lil-piggies.jpg" },
      { name: "3 Lil Piggies", price: 13.95, image: "assets/menu/items/3-lil-piggies.jpg" },
      { name: "Monster Peameal", price: 13.95, image: "assets/menu/items/monster-peameal.jpg" },
      { name: "D'Angelo BELT", price: 13.95, image: "assets/menu/items/dangelo-belt.jpg" },
      { name: "Steak and Egg", price: 14.95, image: "assets/menu/items/steak-egg-sandwich.jpg" }
    ]
  },
  {
    id: "breakfast-dishes",
    name: "Breakfast Dishes",
    image: "assets/menu/breakfast-dishes.jpg",
    items: [
      { name: "Egg, Potato, Salad, Tomato & Green Pepper", price: 12.00 },
      { name: "Frittata Special", price: 16.00 },
      { name: "Megga Special Breakfast", price: 15.00 },
      { name: "Ful Normal", price: 12.00 },
      { name: "Ful Special", price: 15.00, desc: "ፉል" },
      { name: "Fata Normal (with 2)", price: 12.00 },
      { name: "Fata Special (with 2)", price: 15.00, desc: "ፋታ" },
      { name: "Kicha Fitfit", price: 15.00 },
      { name: "Ga’at", price: 15.00 },
      { name: "Dulot Tbsi", price: 20.00 },
      { name: "Keyih Tbsi", price: 20.00 },
      { name: "Standard Breakfast", price: 9.95, image: "assets/menu/items/standard-breakfast.jpg" },
      { name: "Eggs and Beans", price: 10.75, image: "assets/menu/items/eggs-beans.jpg" },
      { name: "The Greek", price: 11.75, image: "assets/menu/items/the-greek-breakfast.jpg" },
      { name: "Build Your Own Meat Lovers", price: 13.95, desc: "4 choices of diner cut", image: "assets/menu/items/meat-lovers.jpg" },
      { name: "The Great One", price: 14.95, image: "assets/menu/items/the-great-one.jpg" },
      { name: "Steak and Eggs", price: 18.95, image: "assets/menu/items/steak-and-eggs.jpg" }
    ]
  },
  {
    id: "benedicts",
    name: "Benedicts",
    image: "assets/menu/benedicts.jpg",
    items: [
      { name: "Canadian", price: 14.95, image: "assets/menu/items/benny-canadian.jpg" },
      { name: "Eggs Florentine", price: 14.95, image: "assets/menu/items/benny-florentine.jpg" },
      { name: "Spicy Benny", price: 14.95, tags: ["s"], image: "assets/menu/items/benny-spicy.jpg" },
      { name: "Greek", price: 15.95, image: "assets/menu/items/benny-greek.jpg" },
      { name: "Grilled Cheese", price: 16.95, image: "assets/menu/items/benny-grilled-cheese.jpg" },
      { name: "Philly Cheese Steak", price: 17.95, image: "assets/menu/items/benny-philly.jpg" },
      { name: "Supreme", price: 17.95, image: "assets/menu/items/benny-supreme.jpg" },
      { name: "Sunrise", price: 17.95, image: "assets/menu/items/benny-sunrise.jpg" },
      { name: "Pulled Pork", price: 17.95, image: "assets/menu/items/benny-pulled-pork.jpg" },
      { name: "Steak", price: 18.95, image: "assets/menu/items/benny-steak.jpg" },
      { name: "Salmon", price: 20.95, image: "assets/menu/items/benny-salmon.jpg" },
      { name: "Halloumi", price: 20.95, image: "assets/menu/items/benny-halloumi.jpg" }
    ]
  },
  {
    id: "omelettes",
    name: "Omelettes",
    image: "assets/menu/omelettes.jpg",
    items: [
      { name: "Spinach and Feta", price: 12.95, image: "assets/menu/items/omelette-spinach-feta.jpg" },
      { name: "Three Cheese", price: 12.95, image: "assets/menu/items/omelette-three-cheese.jpg" },
      { name: "Western", price: 12.95, image: "assets/menu/items/omelette-western.jpg" },
      { name: "Ham and Cheese", price: 12.95, image: "assets/menu/items/omelette-ham-cheese.jpg" },
      { name: "Greek Feta Potato", price: 13.95, image: "assets/menu/items/omelette-greek-potato.jpg" },
      { name: "Veggie", price: 13.95, image: "assets/menu/items/omelette-veggie.jpg" },
      { name: "Bacon and Cheddar", price: 13.95, image: "assets/menu/items/omelette-bacon-cheddar.jpg" },
      { name: "Canadian", price: 13.95, image: "assets/menu/items/omelette-canadian.jpg" }
    ]
  },
  {
    id: "pancakes",
    name: "Pancakes",
    image: "assets/menu/pancakes.jpg",
    items: [
      { name: "Single", price: 3.95, image: "assets/menu/items/pancake-single.jpg" },
      { name: "Stack of 4", price: 8.95, image: "assets/menu/items/pancakes-stack.jpg" },
      { name: "Chocolate Chip", price: 9.95, image: "assets/menu/items/pancakes-chocolate-chip.jpg" },
      { name: "Blueberry", price: 9.95, image: "assets/menu/items/pancakes-blueberry.jpg" }
    ]
  },
  {
    id: "burgers",
    name: "Burgers",
    image: "assets/menu/burgers.jpg",
    items: [
      { name: "Hamburger", price: 11.95, image: "assets/menu/items/hamburger.jpg" },
      { name: "Cheeseburger", price: 13.25, image: "assets/menu/items/cheeseburger.jpg" },
      { name: "Bacon Cheeseburger", price: 14.95, image: "assets/menu/items/bacon-cheeseburger.jpg" },
      { name: "Greek Burger", price: 14.95, image: "assets/menu/items/greek-burger.jpg" },
      { name: "Western", price: 15.95, image: "assets/menu/items/western-burger.jpg" },
      { name: "Uncle Philly", price: 16.95, image: "assets/menu/items/uncle-philly.jpg" },
      { name: "Mob", price: 17.95, image: "assets/menu/items/mob-burger.jpg" },
      { name: "Big Ben", price: 18.95, image: "assets/menu/items/big-ben-burger.jpg" }
    ]
  },
  {
    id: "lunch-dishes",
    name: "Lunch Dishes",
    image: "assets/menu/lunch-dishes.jpg",
    items: [
      { name: "Jerk Salad", price: 8.00, image: "assets/menu/items/jerk-salad.jpg" },
      { name: "Aristotle", price: 12.95, image: "assets/menu/items/aristotle.jpg" },
      { name: "The Herc", price: 12.95, image: "assets/menu/items/the-herc.jpg" },
      { name: "Steak and Salad", price: 15.95, image: "assets/menu/items/steak-and-salad.jpg" },
      { name: "Greek Jerk", price: 15.95, image: "assets/menu/items/greek-jerk.jpg" },
      { name: "Aristotle with Chicken", price: 16.95, image: "assets/menu/items/aristotle-chicken.jpg" },
      { name: "The Herc with Chicken", price: 16.95, image: "assets/menu/items/herc-chicken.jpg" }
    ]
  },
  {
    id: "vegetarian",
    name: "Vegetarian",
    image: "assets/menu/vegetarian.jpg",
    items: [
      { name: "Spicy Veggie Wrap", price: 11.50, tags: ["v", "s"], image: "assets/menu/items/spicy-veggie-wrap.jpg" },
      { name: "Veggie Plate Small", price: 11.50, tags: ["v"], image: "assets/menu/items/veggie-plate-small.jpg" },
      { name: "Veggie Plate Large", price: 13.50, tags: ["v"], image: "assets/menu/items/veggie-plate-large.jpg" },
      { name: "Falafel Plate", price: 13.95, tags: ["v"], image: "assets/menu/items/falafel-plate.jpg" },
      { name: "Tzatziki Veggie Wrap", price: 14.50, tags: ["v"], image: "assets/menu/items/tzatziki-veggie-wrap.jpg" },
      { name: "Hummus Veggie Wrap", price: 14.50, tags: ["v"], image: "assets/menu/items/hummus-veggie-wrap.jpg" },
      { name: "Med Beef Plant Based", price: 15.95, tags: ["v"], image: "assets/menu/items/med-beef-plant-based.jpg" }
    ]
  },
  {
    id: "home-fries-and-sides",
    name: "Home Fries and Sides",
    image: "assets/menu/home-fries-and-sides.jpg",
    items: [
      { name: "Home Fries", price: 4.95, image: "assets/menu/items/home-fries.jpg" },
      { name: "Spicy Home Fries", price: 5.95, tags: ["s"], image: "assets/menu/items/spicy-home-fries.jpg" },
      { name: "Greek Home Fries", price: 8.50, image: "assets/menu/items/greek-home-fries.jpg" },
      { name: "Spicy Home Fries with Cheddar and Bacon", price: 11.50, tags: ["s"], image: "assets/menu/items/loaded-home-fries.jpg" },
      { name: "Bacon", price: 4.95, image: "assets/menu/items/bacon.jpg" },
      { name: "Sausage", price: 4.95, image: "assets/menu/items/sausage.jpg" },
      { name: "Ham", price: 4.95, image: "assets/menu/items/ham.jpg" },
      { name: "Peameal Bacon", price: 5.50, image: "assets/menu/items/peameal-bacon.jpg" },
      { name: "Yogurt and Honey", price: 5.25, image: "assets/menu/items/yogurt-honey.jpg" },
      { name: "Yogurt, Honey and Granola", price: 6.25, image: "assets/menu/items/yogurt-granola.jpg" },
      { name: "Buttered Toast", price: 2.50, image: "assets/menu/items/buttered-toast.jpg" },
      { name: "Gluten Free Toast", price: 3.50, tags: ["gf"], image: "assets/menu/items/gf-toast.jpg" },
      { name: "Hollandaise", price: 3.25, image: "assets/menu/items/hollandaise.jpg" },
      { name: "Extra Grilled Chicken", price: 6.95, image: "assets/menu/items/grilled-chicken.jpg" }
    ]
  }
];
