import BackFunction from "components/buttons/BackFunction";
import Container from "components/containers/Container";
import PortfolioContainer from "components/containers/PortfolioContainer";
import router from "next/router";

export default function AthleteSelect(){
return(
    <>
     <Container activeName="PLAY">
        <BackFunction prev={`/CreateLineup?id=${router.query.id}`} />
        <PortfolioContainer
            title="SELECT"
            textcolor="text-indigo-black"
        >
            <div className="flex flex-col">
                                    <div className="flex items-end pt-10 pb-3 ml-7">
                                      <div className="font-monument text-xl truncate w-40 md:w-min md:max-w-xs">
                                        {teamName}
                                      </div>
                                      <p
                                        className="ml-5 underline text-sm pb-1 cursor-pointer"
                                        onClick={() => setEditModal(true)}
                                      >
                                        EDIT TEAM NAME
                                      </p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-y-4 mt-4 mb-5 md:mb-10 md:grid-cols-4 md:ml-7 md:mt-12">
                                      {/* {team.length > 0 &&
                                        team.map((data, i) => {
                                          return (
                                            <div>
                                              <Lineup
                                                position={data.position.value}
                                                player={
                                                  data.token_info
                                                    ? data.token_info.info.extension.attributes.filter(
                                                        (item) => item.trait_type === 'name'
                                                      )[0].value
                                                    : ''
                                                }
                                                score={data.fantasy_score || 0}
                                                onClick={() => {
                                                  // filterAthleteByPos(data.position.value);
                                                  setSlotIndex(i);
                                                }}
                                                img={
                                                  data.token_info
                                                    ? data.token_info.info.token_uri
                                                    : null
                                                }
                                              />
                                            </div>
                                          );
                                        })} */}
                                        {1 > 0 &&
                                        test.map((data, i) => {
                                          return (
                                            <div>
                                              <Lineup
                                                position={"test"}
                                                player={"test"
                                                  
                                                    ? test2[i]
                                                    : ''
                                                }
                                                score={test[i]}
                                                onClick={() => {
                                                  // filterAthleteByPos(data.position.value);
                                                  setSlotIndex(i);
                                                }}
                                                
                                                img="/images/tokensMLB/SP.png"
                                              />
                                            </div>
                                          );
                                        })}
                                    </div>
                                  </div>
            <div className="flex bg-indigo-black bg-opacity-5 w-full justify-end">
                <button className="bg-indigo-buttonblue text-indigo-white w-full md:w-80 h-14 text-center font-bold text-md">PROCEED</button>
            </div>
        </PortfolioContainer>
    </Container>
    </>
    
 )
}

function setEditModal(arg0: boolean): void {
    throw new Error("Function not implemented.");
}
