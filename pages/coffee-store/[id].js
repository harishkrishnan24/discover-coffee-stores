import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../../styles/coffee-store.module.css';
import cls from 'classnames';
import { fetchCoffeeStores } from '../../lib/coffee-stores';
import { useContext, useState, useEffect } from 'react';
import { StoreContext } from '../../store/store-context';
import { isEmpty } from '../../utils';

export async function getStaticProps({ params }) {
  const coffeeStores = await fetchCoffeeStores();
  const findCoffeeStoresById = coffeeStores.find(
    (coffeeStore) => coffeeStore.id.toString() === params.id
  );
  return {
    props: {
      coffeeStore: findCoffeeStoresById ? findCoffeeStoresById : {},
    },
  };
}

export async function getStaticPaths() {
  const coffeeStores = await fetchCoffeeStores();
  const paths = coffeeStores.map((coffeeStore) => ({
    params: { id: coffeeStore.id.toString() },
  }));
  return {
    paths,
    fallback: true,
  };
}

const CoffeeStore = (initialProps) => {
  const router = useRouter();
  const { id } = router.query;
  const {
    state: { coffeeStores },
  } = useContext(StoreContext);
  const [cofeeStore, setCoffeeStore] = useState(initialProps.cofeeStore);

  useEffect(() => {
    if (isEmpty(initialProps.cofeeStore)) {
      if (coffeeStores.length > 0) {
        const findCoffeeStoresById = coffeeStores.find(
          (coffeeStore) => coffeeStore.id.toString() === id
        );
        setCoffeeStore(findCoffeeStoresById);
      }
    }
  }, [id]);

  if (router.isFallback) {
    return <div>Loading...</div>;
  }
  const { address, name, neighbourhood, imgUrl } = coffeeStore;

  const handleUpvoteButton = () => {};

  return (
    <div className={styles.layout}>
      <Head>
        <title>{name}</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href='/'>
              <a>Back to home</a>
            </Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{name}</h1>
          </div>
          <Image
            src={imgUrl || ''}
            width={600}
            height={360}
            className={styles.storeImg}
            alt={name}
          />
        </div>
        <div className={cls(styles.col2, 'glass')}>
          <div className={styles.iconWrapper}>
            <Image src='/static/icons/places.svg' width='24' height='24' />
            <p className={styles.text}>{address}</p>
          </div>
          {neighbourhood && (
            <div className={styles.iconWrapper}>
              <Image src='/static/icons/nearMe.svg' width='24' height='24' />
              <p className={styles.text}>{neighbourhood}</p>
            </div>
          )}
          <div className={styles.iconWrapper}>
            <Image src='/static/icons/star.svg' width='24' height='24' />
            <p className={styles.text}>{1}</p>
          </div>
          <button className={styles.upvoteButton} onClick={handleUpvoteButton}>
            Up Vote!
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoffeeStore;
