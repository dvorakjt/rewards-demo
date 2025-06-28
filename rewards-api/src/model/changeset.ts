export interface ChangeSet {
  partners: Record<
    string,
    {
      hash: string;
      locationsHash?: string;
      rewards?: Record<string, string>;
    }
  >;
}
