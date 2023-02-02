import React, { useState } from 'react'
import Head from 'next/head'
import { Grid, Container, Header } from 'semantic-ui-react'
import { MealCard } from '../components/Meal_Card'
import { Search } from '../components/Search'

export default function Home() {
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [meals, setMeals] = useState({
    breakfast: {
      image: "https://s3-media0.fl.yelpcdn.com/bphoto/7QIXVmMTIn9S_B60uASQpw/1000s.jpg",
      rating: 0,
      ratingCount: 0
    },
    lunch: {
      image: "https://s3-media0.fl.yelpcdn.com/bphoto/Uxejen4qH1-J0Q0Y7QCluA/1000s.jpg",
      rating: 0,
      ratingCount: 0
    },
    dinner: {
      image: "https://s3-media0.fl.yelpcdn.com/bphoto/7HuEcZ7ny6k1IJcPAskymA/348s.jpg",
      rating: 0,
      ratingCount: 0
    }
  });

  const shuffleMeal = (id, type) => {
    fetch('/api/v1/plan/shuffle' + '?' + (new URLSearchParams({ location: search, id, type })).toString())
      .then((res) => res.json())
      .then((res) => {
        setMeals({ ...meals, ...res });
      })
      .catch((error) => {
        // Do something better with the error eventually
        console.error("Unable to Fetch New Meal");
      });
  }

  const searchButtonPressed = () => {
    setIsLoading(true);
    fetch('/api/v1/plan/generate' + '?' + (new URLSearchParams({ location: search })).toString())
      .then((res) => res.json())
      .then((res) => {
        setMeals(res);
        setIsLoading(false);
      })
      .catch((error) => {
        // Do something better with the error eventually
        console.error("Unable to Fetch Meals");
        setIsLoading(false);
      });
  }

  const updateSearchVal = val => setSearch(val);

  return (
    <div>
      <Head>
        <title>Travel Meal Planner</title>
        <meta
          name="description"
          content="A web application to find an option for Breakfast, Lunch & Dinner!"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container justify="center">
        <Header as='h1' color='black' textAlign='center' style={{ fontFamily: "Bebas Neue", marginTop: "1em", fontSize: '4rem' }}>
          Travel Meal Planner
        </Header>
        <Grid textAlign='center' verticalAlign='middle'>
          <Grid.Column style={{ maxWidth: 300 }}>
            <Search placeholder="Zip Code (ex 10001)" onChangeVal={updateSearchVal} onGo={searchButtonPressed} isLoading={isLoading} />
          </Grid.Column>
        </Grid>
        <Grid columns='equal' centered stackable>
          {/* TODO: Make the following dynamically generated for DRY approach */}
          <Grid.Column>
            <MealCard
              id={meals.breakfast.id}
              mealType="breakfast"
              mealLabel="Breakfast"
              name={meals.breakfast.name}
              imageLink={meals.breakfast.image}
              address={meals.breakfast.address}
              onShuffle={shuffleMeal}
              ratingVal={meals.breakfast.rating}
              ratingCount={meals.breakfast.ratingCount}
            />
          </Grid.Column>
          <Grid.Column>
            <MealCard
              id={meals.lunch.id}
              mealType="lunch"
              mealLabel="Lunch"
              name={meals.lunch.name}
              imageLink={meals.lunch.image}
              address={meals.lunch.address}
              onShuffle={shuffleMeal}
              ratingVal={meals.lunch.rating}
              ratingCount={meals.lunch.ratingCount}
            />
          </Grid.Column>
          <Grid.Column>
            <MealCard
              id={meals.dinner.id}
              mealType="dinner"
              mealLabel="Dinner"
              name={meals.dinner.name}
              imageLink={meals.dinner.image}
              address={meals.dinner.address}
              onShuffle={shuffleMeal}
              ratingVal={meals.dinner.rating}
              ratingCount={meals.dinner.ratingCount}
            />
          </Grid.Column>
        </Grid>
      </Container>
    </div>
  );
}
