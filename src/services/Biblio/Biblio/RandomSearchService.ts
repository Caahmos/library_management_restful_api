import prisma from "../../../prisma/prisma";

class RandomSearchService {
  static async execute(method: 'title' | 'collection' | 'author', number: number) {
    const randomNumbers = [];

    if (method === 'collection') {
      const collections = await prisma.collectionDM.findMany();
      if (collections.length <= 0) throw new Error('Nenhuma coleção encontrada!');

      for (let i = 0; i < number; i++) {
        const fetchBibliosRecursively = async (): Promise<{ collection: any, biblios: any[] }> => {
          const randomCollectionIndex = Math.floor(Math.random() * collections.length);
          const randomCollection = collections[randomCollectionIndex];

          const biblios = await prisma.biblio.findMany({
            where: {
              collection_cd: randomCollection.code
            },
            take: 100
          });

          if (biblios.length >= 15) {
            return { collection: randomCollection, biblios };
          } else {
            return fetchBibliosRecursively();
          }
        };

        const result = await fetchBibliosRecursively();
        randomNumbers.push(result);
      }

      return randomNumbers;
    }
  }
}

export default RandomSearchService;
