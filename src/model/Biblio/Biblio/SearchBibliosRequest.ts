export interface SearchBibliosRequest{
    data: string
    method: 'title' | 'author' | 'collection'
}