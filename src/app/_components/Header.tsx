"use client";
import Link from 'next/link';
import classes from "../_styles/Header.module.css";

export default function Header() {
  return (
    <div>
      <header className={classes.header}>
        <div className={classes.logo}>
		      <Link href='/'>Blog</Link>
		    </div>
		    <div className={classes.contact}>
				  <Link href='/contact'>お問い合わせ</Link>
		    </div>
      </header>
    </div>
  );
}
