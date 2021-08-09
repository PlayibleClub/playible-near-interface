import { Obi } from "@bandprotocol/bandchain.js";
// const { example_proof } = require("./proof_example.js");

const toArrU8 = (x, t = "hex") => [...Buffer.from(x, t)];

const encodeRelayCandidateBlockInput = (proof) => {
  const {
    block_relay_proof: { multi_store_proof, block_header_merkle_parts },
  } = proof;

  const relayCandidateBlockObi = new Obi(
    `{multi_store:{auth_to_ibc_transfer_stores_merkle_hash:[u8],mint_store_merkle_hash:[u8],oracle_iavl_state_hash:[u8],params_to_slash_stores_merkle_hash:[u8],staking_to_upgrade_stores_merkle_hash:[u8]},merkle_paths:{version_and_chain_id_hash:[u8],height:u64,time_second:u64,time_nano_second:u32,last_block_id_and_other:[u8],next_validator_hash_and_consensus_hash:[u8],last_results_hash:[u8],evidence_and_proposer_hash:[u8]}}/{_:u8}`
  );

  const transfromToObiStruct = {
    multi_store: Object.keys(multi_store_proof).reduce((acc, k) => {
      acc[k.toLocaleLowerCase()] = toArrU8(multi_store_proof[k]);
      return acc;
    }, {}),
    merkle_paths: {
      version_and_chain_id_hash: toArrU8(
        block_header_merkle_parts["version_and_chain_id_hash"]
      ),
      height: Number(block_header_merkle_parts["height"]),
      time_second: Number(block_header_merkle_parts["time_second"]),
      time_nano_second: Number(block_header_merkle_parts["time_nano_second"]),
      last_block_id_and_other: toArrU8(
        block_header_merkle_parts["last_block_id_and_other"]
      ),
      next_validator_hash_and_consensus_hash: toArrU8(
        block_header_merkle_parts["next_validator_hash_and_consensus_hash"]
      ),
      last_results_hash: toArrU8(
        block_header_merkle_parts["last_results_hash"]
      ),
      evidence_and_proposer_hash: toArrU8(
        block_header_merkle_parts["evidence_and_proposer_hash"]
      ),
    },
  };

  return relayCandidateBlockObi
    .encodeInput(transfromToObiStruct)
    .toString("hex");
};

const encodeAppendSignatureInput = (proof) => {
    const {
      block_height,
      block_relay_proof: { signatures },
    } = proof;
  
    const appendSignatureInputObi = new Obi(
      `{block_height:u64,signatures:[{r:[u8],s:[u8],v:u8,signed_data_prefix:[u8],signed_data_suffix:[u8]}]}/{_:u8}`
    );
  
    const transfromToObiStruct = {
      block_height: Number(block_height),
      signatures: signatures.map((s) =>
        Object.keys(s).reduce((acc, k) => {
          acc[k.toLocaleLowerCase()] = k == "v" ? Number(s[k]) : toArrU8(s[k]);
          return acc;
        }, {})
      ),
    };
  
    return appendSignatureInputObi
      .encodeInput(transfromToObiStruct)
      .toString("hex");
  };

  const encodeVerifyAndSaveResultInput = (proof) => {
    const {
      block_height,
      oracle_data_proof: { result: r, version, merkle_paths },
    } = proof;
  
    const verifyAndSaveResultObi = new Obi(
      `{block_height:u64,result:{client_id:string,oracle_script_id:u64,calldata:[u8],ask_count:u64,min_count:u64,request_id:u64,ans_count:u64,request_time:u64,resolve_time:u64,resolve_status:u64,result:[u8]},version:u64,merkle_paths:[{is_data_on_right:u8,subtree_height:u8,subtree_size:u64,subtree_version:u64,sibling_hash:[u8]}]}/{_:u8}`
    );
  
    const transfromToObiStruct = {
      block_height: Number(block_height),
      result: Object.keys(r).reduce((acc, k) => {
        acc[k.toLocaleLowerCase()] =
          k == "client_id"
            ? r[k]
            : k == "calldata" || k == "result"
            ? toArrU8(r[k], "base64")
            : Number(r[k]);
        return acc;
      }, {}),
      version: Number(version),
      merkle_paths: merkle_paths.map((m) =>
        Object.keys(m).reduce((acc, k) => {
          acc[k.toLocaleLowerCase()] =
            k == "sibling_hash" ? toArrU8(m[k]) : Number(m[k]);
          return acc;
        }, {})
      ),
    };
  
    return verifyAndSaveResultObi
      .encodeInput(transfromToObiStruct)
      .toString("hex");
  };

const encodeCalldata = (path, keys) => {
    const calldataObi = new Obi(`{path:string,keys:string}/{value:string}`);
  
    const transformToObiStruct = {
      path: path,
      keys: keys,
    };
  
    return calldataObi.encodeInput(transformToObiStruct).toString("hex");
};

export {
    encodeRelayCandidateBlockInput,
    encodeAppendSignatureInput,
    encodeVerifyAndSaveResultInput,
    encodeCalldata
};