import Container from 'components/containers/Container';
import PortfolioContainer from 'components/containers/PortfolioContainer';
import BackFunction from 'components/buttons/BackFunction';

const CompletedGames = (props) => {
  return (
    <Container activeName="Games">
      <div className="mt-8">
        <BackFunction prev="/Play" />
      </div>
      <>
        <PortfolioContainer textcolor="indigo-black" title="GAMES">
          
        </PortfolioContainer>
      </>
    </Container>
  );
};
export default CompletedGames;
