import Board from "../components/Board";
import CommentsModal from "../components/CommentsModal";
import styles from "./page.module.scss";

export default function Page() {
  return (
    <div className={styles.boardPage}>
      <Board />
      <CommentsModal />
    </div>
  );
}
