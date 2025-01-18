export class WordPair {
  constructor(public readonly word: string, public readonly translation: string) {
    if (word === '' || translation === '') {
      throw new Error('Word and translation cannot be empty');
    }
  }

  public equals(cmp: WordPair) {
	return this.word === cmp.word && this.translation === cmp.translation;
  }
}