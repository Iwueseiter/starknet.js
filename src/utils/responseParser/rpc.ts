/**
 * Map RPC Response to common interface response
 * Intersection (sequencer response ∩ (∪ rpc responses))
 */
import {
  CallContractResponse,
  EstimateFeeResponse,
  GetBlockResponse,
  GetTransactionResponse,
  RPC,
  SimulateTransactionResponse,
} from '../../types';
import { toBigInt } from '../num';
import { estimatedFeeToMaxFee } from '../stark';
import { ResponseParser } from '.';

type RpcGetBlockResponse = RPC.GetBlockWithTxHashesResponse & {
  [key: string]: any;
};

type GetTransactionByHashResponse = RPC.GetTransactionByHashResponse & {
  [key: string]: any;
};

export class RPCResponseParser
  implements
    Omit<
      ResponseParser,
      | 'parseDeclareContractResponse'
      | 'parseDeployContractResponse'
      | 'parseInvokeFunctionResponse'
      | 'parseGetTransactionReceiptResponse'
    >
{
  public parseGetBlockResponse(res: RpcGetBlockResponse): GetBlockResponse {
    return {
      timestamp: res.timestamp,
      block_hash: res.block_hash,
      block_number: res.block_number,
      new_root: res.new_root,
      parent_hash: res.parent_hash,
      status: res.status,
      transactions: res.transactions,
    };
  }

  public parseGetTransactionResponse(res: GetTransactionByHashResponse): GetTransactionResponse {
    return {
      calldata: res.calldata || [],
      contract_address: res.contract_address,
      sender_address: res.contract_address,
      max_fee: res.max_fee,
      nonce: res.nonce,
      signature: res.signature || [],
      transaction_hash: res.transaction_hash,
      version: res.version,
    };
  }

  public parseFeeEstimateResponse(res: Array<RPC.EstimateFeeResponse>): EstimateFeeResponse {
    return {
      overall_fee: toBigInt(res[0].overall_fee),
      gas_consumed: toBigInt(res[0].gas_consumed),
      gas_price: toBigInt(res[0].gas_price),
    };
  }

  public parseFeeEstimateOriginalResponse(
    res: Array<RPC.EstimateFeeResponse>
  ): Array<EstimateFeeResponse> {
    return res.map((val) => ({
      overall_fee: toBigInt(val.overall_fee),
      gas_consumed: toBigInt(val.gas_consumed),
      gas_price: toBigInt(val.gas_price),
    }));
  }

  public parseCallContractResponse(res: Array<string>): CallContractResponse {
    return {
      result: res,
    };
  }

  public parseSimulateTransactionResponse(
    res: RPC.SimulateTransactionResponse
  ): SimulateTransactionResponse {
    const withMaxFees = res.simulated_transactions.map((simulated) => {
      return {
        transaction_trace: simulated.transaction_trace,
        fee_estimation: simulated.fee_estimation,
        suggestedMaxFees: estimatedFeeToMaxFee(BigInt(simulated.fee_estimation.overall_fee)),
      };
    });

    return {
      simulated_transactions: withMaxFees,
    };
  }
}
