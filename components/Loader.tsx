"use client";

import React from "react";
import styles from "./Loader.module.css";
import Image from "next/image";

const Loader = () => {
    return (
        <>
        <div className={styles.loadingContainer}>
            <div className={styles.loading}></div>
            <div className={styles.loadingText}>Just a second</div>
            <Image className="mt-2" src="/mtoko.png" alt="Mtoko" width={100} height={30} />
        </div>

        </>
    );
};

export default Loader;
