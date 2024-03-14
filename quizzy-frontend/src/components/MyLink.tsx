import { MdArrowRight } from "react-icons/md";
import styles from "../styles/MyLink.module.css";
import { Link } from "react-router-dom";

type MyLinkProps = { path: string; name: string };

function MyLink(props: MyLinkProps) {
  const { path, name } = props;

  return (
    <div className={styles.link_parent}>
      <Link to={path}>{name}</Link>
      <MdArrowRight />
    </div>
  );
}

export default MyLink;
