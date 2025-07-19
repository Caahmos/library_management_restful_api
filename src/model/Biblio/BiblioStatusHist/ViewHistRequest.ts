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
  copyid?: string;
  mbrid?: string;
  status_cd?: string;
  due?: string;
  limit?: number;
}

export interface ViewHistsSearch {
  bibid?: number;
  copyid?: number;
  mbrid?: number;
  status_cd?: string;
  due?: string;
  limit?: number;
}

export interface DetailHistsRequest {
  bibid?: string;
  copy_barcode?: string;
  member_barcode?: string;
  status_cd?: string;
  due?: string;
  limit?: number;
}

export interface DetailHistsSearch {
  bibid?: number;
  copy_barcode?: string;
  member_barcode?: number;
  status_cd?: string;
  due?: string;
  limit?: number;
}
