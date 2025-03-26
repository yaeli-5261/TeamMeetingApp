export interface MeetingDTO {
    id: number;
    name: string;
    date: string;
    teamId: number;
    linkTranscriptFile: string;
    linkOrinignFile: string;
}

export interface MeetingPostDTO {
    name: string;
    date: string;
    teamId: number;
    linkTranscriptFile: string;
    linkOrinignFile: string;
}
export interface MeetingState {
    meetings: MeetingDTO[];
    loading: boolean;
    error: string | null;
  }
  
export  const initialState: MeetingState = {
    meetings: [],
    loading: false,
    error: null,
  };
  