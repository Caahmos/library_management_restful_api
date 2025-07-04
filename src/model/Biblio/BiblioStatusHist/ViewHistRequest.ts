export interface ViewHistRequest {
  bibid?: string;
  mbrid?: string;
}

export interface ViewHistSearch {
  bibid?: number;
  mbrid?: number;
}

export interface ViewHistsRequest {
  bibid?: string;
  mbrid?: string;
  status_cd?: string;
  due?: string;
  limit?: number;
}

export interface ViewHistsSearch {
  bibid?: number;
  mbrid?: number;
  status_cd?: string;
  due?: string;
  limit?: number;
}
