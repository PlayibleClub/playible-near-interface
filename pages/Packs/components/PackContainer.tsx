import PackComponent from './PackComponent';

const PackContainer = (props) => {
  const { accountPacks } = props;

  function Packs({ accountPacks }) {
    return (
      <>
        {accountPacks &&
          accountPacks.map(({ metadata, token_id }) => (
            <div>
              <PackComponent image={metadata.media} id={token_id}></PackComponent>
            </div>
          ))}
      </>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-y-3 mt-4 md:grid-cols-4 md:ml-7 md:mr-7 md:mt-12">
      <Packs accountPacks={accountPacks}></Packs>
    </div>
  );
};

export default PackContainer;
