import { Outlet, NavLink, Link } from "react-router-dom";

import github from "../../assets/github.svg";

import styles from "./Layout.module.css";

const Layout = () => {
    return (
        <div className={styles.layout}>
            <header className={styles.header} role={"banner"}>
                <div className={styles.headerContainer}>
                    <h3 className={styles.headerText}>OpenAI Chat | Demo</h3>
                </div>
            </header>

            <Outlet />
        </div>
    );
};

export default Layout;
