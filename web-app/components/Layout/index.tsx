import Header from '../Header';

import styles from './Layout.module.css';

export default function Layout({ children }) {
  return (
    <div className={styles.layout}>
      <div className={styles.header}>
        <Header />
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
