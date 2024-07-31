import React from "react";
import { useSelector } from "react-redux";

const AppLoader = () => {
    const loading = useSelector(({ utils }) => utils.loading);

    console.log("Loading state is:", loading);

    if (!loading) {
        return null; // Return null if loading is false
    }

    return (
        <div className="loading-overlay">
            <div className="bounce-loader">
                <div className="bounce1"></div>
                <div className="bounce2"></div>
                <div className="bounce3"></div>
                <div className="bounce4"></div>
            </div>
        </div>
    );
}

export default React.memo(AppLoader);
