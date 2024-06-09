// types.ts
export interface Email {
    id: string;
    snippet: string;
    subject: string;
    from: string;
    classification?: string; // Make classification optional
    body?: string; // Add body property,
    date: string;
    labelIds?: string[] | undefined; // Add labelIds property
}

export interface ClassifiedEmail extends Email {
    classification: string;
}
  