import BackFunction from "components/buttons/BackFunction";
import Container from "components/containers/Container";
import PortfolioContainer from "components/containers/PortfolioContainer";
import router from "next/router";
import PropTypes from 'prop-types';

export default function AthleteSelect(){
return(
    <>
     <Container activeName="PLAY">
        <BackFunction prev={`/CreateLineup?id=${router.query.id}`} />
        <PortfolioContainer
            title="SELECT"
            textcolor="text-indigo-black"
        >
            <div className="flex bg-indigo-black bg-opacity-5 w-full justify-end">
                <button className="bg-indigo-buttonblue text-indigo-white w-full md:w-80 h-14 text-center font-bold text-md">PROCEED</button>
            </div>
        </PortfolioContainer>
    </Container>
    </>
    
 )
}