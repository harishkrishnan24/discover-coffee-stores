import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useState, useContext } from 'react';
import Banner from '../components/banner';
import Card from '../components/card';
import useTrackLocation from '../hooks/use-track-location';
import { fetchCoffeeStores } from '../lib/coffee-stores';
import styles from '../styles/Home.module.css';
import { ACTION_TYPES, StoreContext } from '../store/store-context';

export async function getStaticProps(context) {
  const coffeeStores = await fetchCoffeeStores();

  return {
    props: {
      coffeeStores,
    },
  };
}

export default function Home(props) {
  const { handleTrackLocation, locationErrorMsg, isFindingLocation } =
    useTrackLocation();
  const [coffeeStoresError, setCoffeeStoresError] = useState(null);
  const { dispatch, state } = useContext(StoreContext);
  const { coffeeStores, latLong } = state;

  useEffect(() => {
    async function fetchStores() {
      if (latLong) {
        try {
          const fetchedCoffeeStores = await fetchCoffeeStores(latLong, 30);
          // setCoffeeStores(fetchCoffeeStores);
          dispatch({
            type: ACTION_TYPES.SET_COFFEE_STORES,
            payload: { coffeeStores: fetchedCoffeeStores },
          });
        } catch (error) {
          console.log(error);
          setCoffeeStoresError(error.message);
        }
      }
    }
    fetchStores();
  }, [latLong]);

  const handleOnBannerBtnClick = () => {
    handleTrackLocation();
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Connoisseur</title>
        <meta name='description' content='Coffee Connoisseur App' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main}>
        <Banner
          buttonText={isFindingLocation ? 'Locating...' : 'View stores nearby'}
          handleOnClick={handleOnBannerBtnClick}
        />
        {locationErrorMsg && <p>Something went wrong: {locationErrorMsg}</p>}
        <div className={styles.heroImage}>
          <Image src='/static/hero-image.png' width={700} height={400} />
        </div>
        {coffeeStoresError && <p>{coffeeStoresError}</p>}
        {coffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Stores near me</h2>
            <div className={styles.cardLayout}>
              {coffeeStores.map((coffeeStore) => (
                <Card
                  key={coffeeStore.id}
                  className={styles.card}
                  name={coffeeStore.name}
                  imgUrl={coffeeStore.imgUrl || ''}
                  href={`/coffee-store/${coffeeStore.id}`}
                />
              ))}
            </div>
          </div>
        )}
        {props.coffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Toronto stores</h2>
            <div className={styles.cardLayout}>
              {props.coffeeStores.map((coffeeStore) => (
                <Card
                  key={coffeeStore.id}
                  className={styles.card}
                  name={coffeeStore.name}
                  imgUrl={coffeeStore.imgUrl || ''}
                  href={`/coffee-store/${coffeeStore.id}`}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
