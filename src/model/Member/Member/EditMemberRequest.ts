export interface EditMemberRequest {
    first_name?: string
    last_name?: string
    barcode_nmbr?: string
    address?: string
    home_phone?: string
    work_phone?: string
    email?: string
    last_change_userid?: number
    code?: string[]
    data?: string[]
    classification?: number
}

export interface EditMember {
  first_name?: string;
  last_name?: string;
  barcode_nmbr?: string;
  address?: string;
  home_phone?: string;
  work_phone?: string;
  email?: string;
  last_change_userid?: number;
  classification?: number;
}

export interface MemberFields {
  code?: string[];
  data?: string[];
}
