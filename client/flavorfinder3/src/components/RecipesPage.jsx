import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, ListGroup, Button, Form } from 'react-bootstrap';
import './RecipesPage.css';
// import axios from "axios"

// Hard-coded recipes
const recipes = [
  {
    "id": 1,
    "name": "Spaghetti Carbonara",
    "ingredients": "Spaghetti, eggs, pancetta, black pepper, Parmesan cheese",
    "instructions": "Cook spaghetti. Fry pancetta until crispy. Beat eggs, mix with cheese. Combine with hot spaghetti. Serve with black pepper.",
    "category": "Pasta",
    "image_url": "https://keyassets-p2.timeincuk.net/wp/prod/wp-content/uploads/sites/53/2018/07/Spaghetti-carbonara-recipe.jpg"
  },
  {
    "id": 2,
    "name": "Chicken Tikka Masala",
    "ingredients": "Chicken breast, yogurt, tomatoes, cream, spices",
    "instructions": "Marinate chicken in yogurt and spices. Grill until charred. Simmer in tomato cream sauce. Serve with rice.",
    "category": "Curry",
    "image_url": "https://www.seriouseats.com/thmb/fMfwR6_SOluWtgc7zHdzg3NQ3Ck=/1500x1125/filters:fill(auto,1)/chicken-tikka-masala-for-the-grill-recipe-hero-2_1-cb493f49e30140efbffec162d5f2d1d7.JPG"
  },
  {
    "id": 3,
    "name": "Caesar Salad",
    "ingredients": "Romaine lettuce, croutons, Parmesan cheese, Caesar dressing",
    "instructions": "Toss lettuce, croutons, and cheese. Add dressing, toss well. Serve chilled.",
    "category": "Salad",
    "image_url": "https://www.thespruceeats.com/thmb/Z6IWF7c9zywuU9maSIimGLbHoI4=/3000x2000/filters:fill(auto,1)/classic-caesar-salad-recipe-996054-Hero_01-33c94cc8b8e841ee8f2a815816a0af95.jpg"
  },
  {
    "id": 4,
    "name": "Beef Stroganoff",
    "ingredients": "Beef sirloin, onions, mushrooms, sour cream, egg noodles",
    "instructions": "Saute onions and mushrooms. Brown beef, add sour cream. Serve over egg noodles.",
    "category": "Beef",
    "image_url": "https://www.platingsandpairings.com/wp-content/uploads/2020/12/instant-pot-beef-stroganoff-10-1365x2048.jpg"
  },
  {
    "id": 5,
    "name": "Margherita Pizza",
    "ingredients": "Pizza dough, mozzarella cheese, tomatoes, basil, olive oil",
    "instructions": "Stretch dough, spread olive oil. Top with sliced tomatoes, cheese, and basil. Bake until crust is golden.",
    "category": "Pizza",
    "image_url": "https://cdn.loveandlemons.com/wp-content/uploads/2019/09/margherita-pizza-1080x1080.jpg"
  },
  {
    "id": 6,
    "name": "Chocolate Chip Cookies",
    "ingredients": "Flour, butter, sugar, chocolate chips, vanilla extract",
    "instructions": "Cream butter and sugar. Mix in flour, chips, vanilla. Bake until golden brown.",
    "category": "Dessert",
    "image_url": "https://www.modernhoney.com/wp-content/uploads/2017/12/Charminas-Chocolate-Chip-Cookies-1.jpg"
  },
  {
    "id": 7,
    "name": "Sushi Rolls",
    "ingredients": "Sushi rice, seaweed, fish, vegetables, soy sauce, wasabi",
    "instructions": "Spread rice on seaweed, add fish, veggies. Roll tightly. Slice and serve with soy sauce and wasabi.",
    "category": "Japanese",
    "image_url": "https://tse4.mm.bing.net/th?id=OIP.t7ViC4kHQtkuStoRXRvetwHaE8&pid=Api&P=0&h=220"
  },
  {
    "id": 8,
    "name": "Chicken Caesar Wrap",
    "ingredients": "Grilled chicken, romaine lettuce, Parmesan cheese, Caesar dressing, tortilla",
    "instructions": "Layer tortilla with lettuce, cheese, chicken, and dressing. Roll tightly and serve.",
    "category": "Wrap",
    "image_url": "https://eatup.kitchen/wp-content/uploads/2018/07/Chicken-Tender-Caesar-Wrap_DSCF0641.jpg"
  },
  {
    "id": 9,
    "name": "Tom Yum Soup",
    "ingredients": "Shrimp, lemongrass, galangal, lime leaves, chili peppers, fish sauce, lime juice",
    "instructions": "Simmer lemongrass, galangal, lime leaves. Add shrimp, chili peppers, fish sauce. Finish with lime juice.",
    "category": "Soup",
    "image_url": "https://www.recipetineats.com/tachyon/2019/09/Tom-Yum-creamy-version_6.jpg"
  },
  {
    "id": 10,
    "name": "Beef Tacos",
    "ingredients": "Ground beef, tortillas, lettuce, tomatoes, cheese, salsa",
    "instructions": "Brown beef, season. Heat tortillas, fill with beef, lettuce, tomatoes, cheese, salsa. Serve hot.",
    "category": "Mexican",
    "image_url": "https://www.cookingclassy.com/wp-content/uploads/2017/10/shredded-beef-tacos-6.jpg"
  },
  {
    "id": 11,
    "name": "Caprese Salad",
    "ingredients": "Tomatoes, mozzarella cheese, basil, olive oil, balsamic glaze",
    "instructions": "Slice tomatoes, cheese. Arrange with basil. Drizzle with oil, glaze. Serve chilled.",
    "category": "Salad",
    "image_url": "https://glutenfreeitalianeats.com/wp-content/uploads/2022/06/close-up-of-caprese-salad-2.jpg"
  },
  {
    "id": 12,
    "name": "Pasta Primavera",
    "ingredients": "Pasta, assorted vegetables, olive oil, garlic, Parmesan cheese",
    "instructions": "Boil pasta. Saute vegetables, garlic. Toss with pasta, oil, cheese. Serve hot.",
    "category": "Pasta",
    "image_url": "https://cdn.apartmenttherapy.info/image/fetch/f_auto,q_auto:eco/https://storage.googleapis.com/gen-atmedia/3/2018/04/a9696fb4dd17254516d5ebca8e3705ac7243dcfa.jpeg"
  },
  {
    "id": 13,
    "name": "Lemon Garlic Roast Chicken",
    "ingredients": "Whole chicken, lemon, garlic, thyme, olive oil, salt, pepper",
    "instructions": "Rub chicken with oil, lemon, garlic, thyme, salt, pepper. Roast until golden brown.",
    "category": "Chicken",
    "image_url": "https://4.bp.blogspot.com/-BY9NWtb-LLA/We_EOn_uVBI/AAAAAAAASHs/sTbatAEzNL407-8sW3pi0pXwn1dXo68tQCLcBGAs/s1600/Lemon%2BGarlic%2BRoasted%2BChicken.jpg"
  },
  {
    "id": 14,
    "name": "Ratatouille",
    "ingredients": "Eggplant, zucchini, bell peppers, tomatoes, garlic, herbs",
    "instructions": "Slice vegetables, layer in baking dish. Bake with tomatoes, garlic, herbs. Serve hot.",
    "category": "Vegetarian",
    "image_url": "https://1.bp.blogspot.com/-i1YPcdES0Jc/UT3Nwh9IJ1I/AAAAAAAABUc/R_PXP1hV97o/s1600/Ratatouille.jpg"
  },
  {
    "id": 15,
    "name": "Key Lime Pie",
    "ingredients": "Graham cracker crust, condensed milk, lime juice, eggs, sugar, whipped cream",
    "instructions": "Mix milk, lime juice, egg yolks. Pour into crust. Bake, cool. Top with whipped cream.",
    "category": "Dessert",
    "image_url": "https://cookingclassy.com/wp-content/uploads/2019/03/key-lime-pie-19.jpg"
  },
  {
    "id": 16,
    "name": "Pad Thai",
    "ingredients": "Rice noodles, shrimp, tofu, peanuts, bean sprouts, tamarind sauce",
    "instructions": "Soak noodles. Stir-fry shrimp, tofu, sauce. Add noodles, sprouts, peanuts. Serve hot.",
    "category": "Thai",
    "image_url": "https://www.jocooks.com/wp-content/uploads/2019/07/pad-thai-1.jpg"
  },
  {
    "id": 17,
    "name": "BBQ Ribs",
    "ingredients": "Pork ribs, BBQ sauce, spices",
    "instructions": "Rub ribs with spices. Grill until tender. Brush with BBQ sauce. Serve hot.",
    "category": "Barbecue",
    "image_url": "https://static.fanpage.it/wp-content/uploads/sites/22/2021/01/barbecue-ribs-cop.jpg"
  },
  {
    "id": 18,
    "name": "Fettuccine Alfredo",
    "ingredients": "Fettuccine pasta, butter, heavy cream, Parmesan cheese, garlic, parsley",
    "instructions": "Cook pasta. Melt butter, add cream, cheese, garlic. Toss with pasta, parsley. Serve hot.",
    "category": "Pasta",
    "image_url": "https://i1.wp.com/eatsdelightful.com/wp-content/uploads/2020/09/fettuccine-alfredo-complete.jpg?fit=1728%2C1996&ssl=1"
  },
  {
    "id": 19,
    "name": "Tiramisu",
    "ingredients": "Ladyfingers, espresso, mascarpone cheese, cocoa powder, rum",
    "instructions": "Dip ladyfingers in espresso. Layer with mascarpone mixture. Dust with cocoa. Chill.",
    "category": "Dessert",
    "image_url": "https://sallysbakingaddiction.com/wp-content/uploads/2019/06/homemade-tiramisu-2.jpg"
  },
  {
    "id": 20,
    "name": "Falafel",
    "ingredients": "Chickpeas, herbs, spices, tahini sauce, pita bread",
    "instructions": "Blend chickpeas, herbs, spices. Form into balls, fry. Serve in pita with tahini sauce.",
    "category": "Middle Eastern",
    "image_url": "https://www.thespruceeats.com/thmb/bZ5bPLAX523k6hfCBlbY1kRKW8k=/5696x3797/filters:no_upscale():max_bytes(150000):strip_icc()/what-is-falafel-2355693-Final-5babf51fc9e77c0025f0b9e7.jpg"
  },
  {
    "id": 21,
    "name": "Beef Wellington",
    "ingredients": "Beef tenderloin, mushrooms, puff pastry, prosciutto, egg yolk",
    "instructions": "Sear beef, wrap in prosciutto, mushrooms, pastry. Brush with egg. Bake until golden.",
    "category": "Beef",
    "image_url": "https://media2.popsugar-assets.com/files/thumbor/mdpVZXkf2dvqIU5N2nEMw9GDoNg/fit-in/2048xorig/filters:format_auto-!!-:strip_icc-!!-/2014/09/25/054/n/1922195/e3193653d46184b7_beef-wellington.jpg"
  },
{
    "id": 22,
    "name": "Mango Sticky Rice",
    "ingredients": "Sticky rice, mango, coconut milk, sugar, salt, sesame seeds",
    "instructions": "Cook sticky rice. Mix with coconut milk, sugar, salt. Serve with mango slices. Sprinkle sesame seeds.",
    "category": "Dessert",
    "image_url": "https://takestwoeggs.com/wp-content/uploads/2021/07/Thai-Mango-Sticky-Rice-Takestwoeggs-Process-Final-sq.jpg"
  },
  {
    "id": 23,
    "name": "Shrimp Scampi",
    "ingredients": "Shrimp, linguine pasta, garlic, butter, white wine, parsley, lemon juice",
    "instructions": "Boil pasta. Saute shrimp, garlic in butter. Add wine, lemon juice, parsley. Toss with pasta.",
    "category": "Seafood",
    "image_url": "https://cdn.apartmenttherapy.info/image/fetch/f_auto,q_auto:eco,w_1460/https://storage.googleapis.com/gen-atmedia/3/2018/05/afb854bbaf7e0d4a3c46d5b65f2c04005f022a69.jpeg"
  },
  {
    "id": 24,
    "name": "Chicken Fried Rice",
    "ingredients": "Rice, chicken breast, eggs, soy sauce, vegetables (peas, carrots, onions), garlic",
    "instructions": "Cook rice. Stir-fry chicken, eggs, vegetables, garlic. Add rice, soy sauce. Mix well and serve hot.",
    "category": "Chicken",
    "image_url": "https://www.licious.in/blog/wp-content/uploads/2020/12/Chicken-Fried-Rice-min.jpg"
  },
  {
    "id": 25,
    "name": "Eggplant Parmesan",
    "ingredients": "Eggplant, mozzarella cheese, Parmesan cheese, marinara sauce, breadcrumbs, olive oil",
    "instructions": "Slice and bread eggplant. Fry until golden. Layer with sauce, cheeses. Bake until bubbly.",
    "category": "Vegetarian",
    "image_url": "https://tse2.mm.bing.net/th?id=OIP.u_eMQliGSiJ2eNI27MpttAHaFj&pid=Api&P=0&h=220"
  },
  {
    "id": 26,
    "name": "Creme Brulee",
    "ingredients": "Heavy cream, egg yolks, sugar, vanilla extract",
    "instructions": "Mix cream, yolks, sugar, vanilla. Bake in ramekins. Chill, sprinkle sugar. Caramelize with torch.",
    "category": "Dessert",
    "image_url": "https://resize.elle.fr/original/var/plain_site/storage/images/elle-a-table/recettes-de-cuisine/creme-brulee-facile-2894406/52734072-1-fre-FR/Creme-brulee-facile.jpeg"
  },
  {
    "id": 27,
    "name": "Beef Bulgogi",
    "ingredients": "Beef sirloin, soy sauce, sugar, garlic, sesame oil, green onions",
    "instructions": "Marinate beef in soy, sugar, garlic, oil. Grill until charred. Serve with onions over rice.",
    "category": "Beef",
    "image_url": "https://www.wandercooks.com/wp-content/uploads/2021/03/korean-beef-bugolgi-shiitake-mushroom-4.jpg"
  },
  {
    "id": 28,
    "name": "Spinach and Ricotta Stuffed Shells",
    "ingredients": "Jumbo pasta shells, spinach, ricotta cheese, marinara sauce, mozzarella cheese, garlic",
    "instructions": "Boil shells. Mix spinach, ricotta, garlic. Stuff shells, top with sauce, cheese. Bake until melted.",
    "category": "Pasta",
    "image_url": "https://wholeandheavenlyoven.com/wp-content/uploads/2021/02/Spinach-Ricotta-Stuffed-Shells-Closeup-Pan-683x1024.jpg"
  },
  {
    "id": 29,
    "name": "Gyoza",
    "ingredients": "Ground pork, garlic, ginger, green onions, soy sauce, sesame oil, gyoza wrappers",
    "instructions": "Mix pork, garlic, ginger, onions, sauce, oil. Fill wrappers, seal. Fry, steam. Serve with dipping sauce.",
    "category": "Japanese",
    "image_url": "https://www.chopstickchronicles.com/wp-content/uploads/2020/09/Gyoza-Update-2020-2-1024x1024.jpg"
  },
  {
    "id": 30,
    "name": "Ravioli with Sage Butter Sauce",
    "ingredients": "Ravioli (cheese or meat), butter, sage leaves, Parmesan cheese, salt, pepper",
    "instructions": "Boil ravioli. Melt butter, sage. Toss with ravioli. Sprinkle with cheese, salt, pepper.",
    "category": "Pasta",
    "image_url": "https://www.budgetbytes.com/wp-content/uploads/2018/10/Ravioli-with-Sage-Brown-Butter-Sauce-on-plate.jpg"
  },
  {
    "id": 31,
    "name": "Chicken Shawarma",
    "ingredients": "Chicken thighs, yogurt, lemon juice, garlic, spices, pita bread, tahini sauce",
    "instructions": "Marinate chicken in yogurt, lemon, garlic, spices. Grill until cooked. Serve in pita with tahini.",
    "category": "Middle Eastern",
    "image_url": "https://lifeloveandgoodfood.com/wp-content/uploads/2020/04/Chicken-Shawarma_09_1200x1200.jpg"
  },
  {
    "id": 32,
    "name": "Lamb Tagine",
    "ingredients": "Lamb, onions, tomatoes, chickpeas, raisins, spices, couscous",
    "instructions": "Brown lamb. Saute onions, tomatoes, spices. Add chickpeas, raisins. Simmer. Serve with couscous.",
    "category": "Moroccan",
    "image_url": "https://tse3.mm.bing.net/th?id=OIP.7FoOTcFO56t-XVc91DjFtwHaE9&pid=Api&P=0&h=220"
  },
  {
    "id": 33,
    "name": "Quiche Lorraine",
    "ingredients": "Pie crust, eggs, bacon, cheese, cream, onions, nutmeg",
    "instructions": "Bake pie crust. Cook bacon, onions. Mix eggs, cream, cheese, nutmeg. Pour into crust. Bake until set.",
    "category": "French",
    "image_url": "https://www.simplyrecipes.com/thmb/rfneTPyP3cUFVJ06Uqs9p5OkDOk=/3900x0/filters:no_upscale():max_bytes(150000):strip_icc()/Simply-Recipes-Quiche-Lorraine-LEAD-4-bbc2620b4ce444629038f602b6f1b533.jpg"
  },
  {
    "id": 34,
    "name": "Gazpacho",
    "ingredients": "Tomatoes, cucumber, bell peppers, onions, garlic, olive oil, vinegar, bread, herbs",
    "instructions": "Blend tomatoes, veggies, bread, oil, vinegar. Chill. Serve cold, garnished with herbs.",
    "category": "Soup",
    "image_url": "https://assets.epicurious.com/photos/57bb32e1ac22d6f011674014/master/pass/gazpacho.jpg"
  },
  {
    "id": 35,
    "name": "Chicken Enchiladas",
    "ingredients": "Chicken breast, tortillas, cheese, enchilada sauce, onions, peppers, spices",
    "instructions": "Cook chicken, shred. Roll in tortillas with cheese, onions, peppers. Top with sauce, bake until bubbly.",
    "category": "Mexican",
    "image_url": "https://www.tasteofhome.com/wp-content/uploads/2018/01/Creamy-Chicken-Enchiladas_EXPS_DIA18_33124_B05_25_2b-4.jpg"
  },
  {
    "id": 36,
    "name": "Beef Pho",
    "ingredients": "Beef bones, rice noodles, beef slices, onions, herbs (Thai basil, cilantro), lime, chili peppers",
    "instructions": "Simmer bones for broth. Cook noodles. Top with beef, onions, herbs. Serve with lime, peppers.",
    "category": "Vietnamese",
    "image_url": "https://www.simplyrecipes.com/thmb/6NSfqz9vDog4Ct97ZKaEeG5ByFs=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/__opt__aboutcom__coeus__resources__content_migration__simply_recipes__uploads__2019__04__Beef-Pho-LEAD-2-afc6b6a9144947fb9d72070d7ea8c95c.jpg"
  },
  {
    "id": 37,
    "name": "Chicken Piccata",
    "ingredients": "Chicken breasts, flour, lemon, capers, white wine, chicken broth, butter",
    "instructions": "Dredge chicken in flour. Saute until golden. Add lemon, capers, wine, broth, butter. Simmer.",
    "category": "Chicken",
    "image_url": "https://www.tasteofhome.com/wp-content/uploads/2018/01/EXPS_181384_THD143241B02_04_1bC_RMS-1.jpg"
  },
  {
    "id": 38,
    "name": "Moussaka",
    "ingredients": "Eggplant, potatoes, ground lamb or beef, tomatoes, onions, garlic, cinnamon, nutmeg, bechamel sauce",
    "instructions": "Layer eggplant, potatoes, meat sauce. Top with bechamel. Bake until golden.",
    "category": "Greek",
    "image_url": "https://www.196flavors.com/wp-content/uploads/2016/01/moussaka-4-FP.jpg"
  },
  {
    "id": 39,
    "name": "Tandoori Chicken",
    "ingredients": "Chicken thighs, yogurt, lemon juice, garlic, ginger, spices (cumin, coriander, paprika, turmeric)",
    "instructions": "Marinate chicken in yogurt, lemon, garlic, ginger, spices. Grill until charred. Serve hot.",
    "category": "Indian",
    "image_url": "https://tse2.mm.bing.net/th?id=OIP.21xfGQ9jUczQhBfBTgASHwHaEJ&pid=Api&P=0&h=220"
  },
  {
    "id": 40,
    "name": "Pulled Pork Sandwiches",
    "ingredients": "Pork shoulder, BBQ sauce, buns, coleslaw",
    "instructions": "Rub pork with spices. Slow-cook until tender. Shred, mix with sauce. Serve on buns with coleslaw.",
    "category": "Sandwich",
    "image_url": "https://www.tasteofhome.com/wp-content/uploads/2017/10/Tangy-Pulled-Pork-Sandwiches_EXPS_HSCBZ16_23772_B07_29_2b-1.jpg"
  },
  {
    "id": 41,
    "name": "Chocolate Mousse",
    "ingredients": "Chocolate, eggs, sugar, cream, vanilla extract",
    "instructions": "Melt chocolate. Mix yolks, sugar, vanilla. Fold in melted chocolate. Fold in whipped cream. Chill.",
    "category": "Dessert",
    "image_url": "https://lilluna.com/wp-content/uploads/2018/11/chocolate-mousse-recipe-1-1.jpg"
  },
  {
    "id": 42,
    "name": "Beef Empanadas",
    "ingredients": "Ground beef, onions, bell peppers, olives, raisins, cumin, paprika, puff pastry",
    "instructions": "Saute beef, onions, peppers. Add olives, raisins, spices. Fill pastry, seal. Bake until golden.",
    "category": "Latin American",
    "image_url": "https://tse4.mm.bing.net/th?id=OIP.pVqtasciNEQzXgzmWWkY3gHaGj&pid=Api&P=0&h=220"
  },
  {
    "id": 43,
    "name": "Chicken Pot Pie",
    "ingredients": "Chicken breast, carrots, peas, onions, celery, puff pastry, chicken broth, cream",
    "instructions": "Cook chicken, veggies. Mix with broth, cream. Fill pastry. Bake until golden.",
    "category": "Chicken",
    "image_url": "https://www.eatwell101.com/wp-content/uploads/2017/12/Chicken-Pot-Pie.jpg"
  },
  {
    "id": 44,
    "name": "Lobster Risotto",
    "ingredients": "Arborio rice, lobster tails, shallots, garlic, white wine, Parmesan cheese, butter",
    "instructions": "Saute shallots, garlic. Add rice, wine. Stir in lobster, cheese, butter. Cook until creamy.",
    "category": "Seafood",
    "image_url": "https://bakeitwithlove.com/wp-content/uploads/2021/05/Lobster-Risotto-sq.png"
  },
  {
    "id": 45,
    "name": "Tuna Nicoise Salad",
    "ingredients": "Tuna steak, mixed greens, potatoes, green beans, tomatoes, eggs, olives, anchovies, Dijon vinaigrette",
    "instructions": "Grill tuna. Boil potatoes, beans, eggs. Arrange with greens, tomatoes, olives, anchovies. Dress with vinaigrette.",
    "category": "Salad",
    "image_url": "https://cleanfoodcrush.com/wp-content/uploads/2017/02/Tuna-Nicoise-Salad-Clean-Eating-Recipe.jpg"
  },
  {
    "id": 46,
    "name": "Spanakopita",
    "ingredients": "Spinach, feta cheese, phyllo dough, onions, garlic, dill, olive oil",
    "instructions": "Saute spinach, onions, garlic. Mix with feta, dill, oil. Layer phyllo with mixture. Bake until golden.",
    "category": "Greek",
    "image_url": "https://hildaskitchenblog.com/wp-content/uploads/2019/09/spanakopitah4-1200x800.jpg"
  },
  {
    "id": 47,
    "name": "Pork Carnitas",
    "ingredients": "Pork shoulder, orange juice, garlic, cumin, oregano, bay leaves, tortillas",
    "instructions": "Marinate pork in juice, garlic, spices. Slow-cook until tender. Shred. Serve in tortillas.",
    "category": "Mexican",
    "image_url": "https://barefeetinthekitchen.com/wp-content/uploads/2012/12/Pork-Carnitas-ready-to-eat-with-tortillas-3-1-of-1.jpg"
  }
]

const RecipesPage = () => {
  const [filteredRecipes, setFilteredRecipes] = useState(recipes);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedRecipeId, setExpandedRecipeId] = useState(null);

  // State to track favorited recipe IDs (using localStorage)
  const [favorites, setFavorites] = useState(() => {
    const storedFavorites = localStorage.getItem("favorites");
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  });

  useEffect(() => {
    // Save favorites to localStorage whenever it changes
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    filterRecipes(e.target.value);
  };

  const filterRecipes = (query) => {
    if (!query) {
      setFilteredRecipes(recipes);
    } else {
      const normalizedQuery = query.toLowerCase();
      const filtered = recipes.filter(
        (recipe) =>
          recipe.name.toLowerCase().includes(normalizedQuery) ||
          recipe.ingredients.toLowerCase().includes(normalizedQuery) ||
          recipe.category.toLowerCase().includes(normalizedQuery)
      );
      setFilteredRecipes(filtered);
    }
  };

  // Toggle favorite status of a recipe
  const toggleFavorite = (recipeId) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.includes(recipeId)) {
        // Remove from favorites
        return prevFavorites.filter((id) => id !== recipeId);
      } else {
        // Add to favorites
        return [...prevFavorites, recipeId];
      }
    });
  };

  const handleCardClick = (recipeId) => {
    if (expandedRecipeId === recipeId) {
      // If already expanded, collapse it
      setExpandedRecipeId(null);
    } else {
      // Expand the clicked recipe
      setExpandedRecipeId(recipeId);
    }
  };

  return (
    <Container className="recipes-page">
      <h1 className="recipes-title">Explore New Flavors!</h1>
      <Form.Group controlId="recipe-searchForm">
        <Form.Control
          type="text"
          placeholder="Search recipes..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </Form.Group>

      <Row className="recipes-grid">
        {filteredRecipes.map((recipe) => (
          <Col key={recipe.id} sm={12} md={6} lg={4} className="mb-4">
            <Card
              className="recipe-card"
              onClick={() => handleCardClick(recipe.id)}
              style={{ height: expandedRecipeId === recipe.id ? 'auto' : '300px' }}
            >
              <Card.Img variant="top" src={recipe.image_url} />
              <Card.Body>
                <Card.Title>{recipe.name}</Card.Title>
                <Button
                  style={{backgroundColor: favorites.includes(recipe.id) ? 'green' : ''}}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(recipe.id);
                  }}
                >
                  {favorites.includes(recipe.id) ? "Favorited!!" : "Favorite"}
                </Button>

                {/* Conditional Rendering of Recipe Details */}
                {expandedRecipeId === recipe.id && (
                  <div>
                    <ListGroup className="list-group-flush">
                      <ListGroup.Item>
                        <strong>Category:</strong> {recipe.category}
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <strong>Ingredients:</strong> {recipe.ingredients}
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <strong>Instructions:</strong> {recipe.instructions}
                      </ListGroup.Item>
                    </ListGroup>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default RecipesPage;
