import Image from 'next/image';
import { SigninButton } from '../SigninButton';
import styles from './styles.module.scss';
import { ActiveLink } from '../ActiveLink';

export function Header() {
  

  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Image 
          src="/images/logo.svg"
          alt="ig.news"
          width={100}
          height={60}
        />
        <nav>
          <ActiveLink activeClassName={styles.active} href="/">
            <a className={styles.active} href="">Home</a>
          </ActiveLink>
          <ActiveLink activeClassName={styles.active} href="/posts" prefetch>
            <a href="">Posts</a>
          </ActiveLink>
        </nav>
        <SigninButton />
      </div>
    </header>
  );
}