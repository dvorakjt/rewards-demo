interface LastModifiedAt {
  lastModifiedAt: string;
}

interface PartnerChangeSet extends LastModifiedAt {
  locationsLastModifiedAt: string;
  rewards: Record<string, LastModifiedAt>;
}

export interface IChangeSet {
  partners: Record<string, PartnerChangeSet>;
}
