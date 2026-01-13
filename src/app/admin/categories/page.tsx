import Link from "next/link";
import classes from "../../_styles/Admin.module.css";
import { CategoriesIndexResponse } from "../../_types/PrismaTypes";
import { getDateString } from "../../_utils/getDateString";

async function getCategories(): Promise<CategoriesIndexResponse> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/categories`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch categories');
  }

  return res.json();
}

export default async function CategoriesPage() {
  const { categories } = await getCategories();

  return (
    <>
      <div className={classes.header}>
        <h1 className={classes.title}>カテゴリー一覧</h1>
        <Link href="/admin/categories/new" className={classes.createButton}>
          新規作成
        </Link>
      </div>
      <ul className={classes.postList}>
        {categories.map((category) => (
          <li key={category.id} className={classes.postItem}>
            <Link href={`/admin/categories/${category.id}`} className={classes.postLink}>
              <h2 className={classes.postTitle}>{category.name}</h2>
              <p className={classes.postDate}>
                {getDateString(category.createdAt)}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
