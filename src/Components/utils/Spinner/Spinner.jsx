import { ThreeCircles } from "react-loader-spinner";

const Spinner = () => {
    return (
        <div
            className="d-flex justify-content-center align-items-center vh-100"
        >
            <ThreeCircles
                visible={true}
                height="250"
                width="250"
                ariaLabel="three-circles-loading"
                outerCircleColor="#0A5275"  
                middleCircleColor="#0c6c94"  
                innerCircleColor="#121212" 
                color="#0A5275"             
            />
        </div>
    );
};

export default Spinner;
