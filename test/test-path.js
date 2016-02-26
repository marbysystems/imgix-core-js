import assert from "assert";
import Path from "../src/path";

describe('Path', () => {
  describe('constructor', () => {
    it('initializes with the correct values', () => {
      let path = new Path('/path/to/image.png', 'my-source.imgix.net');
      assert.equal(path.path, "/path/to/image.png");
      assert.equal(path.host, "my-source.imgix.net");
      assert.equal(path.token, null);
      assert.equal(path.secure, true);
    });
  });

  describe('toString', () => {
    it('transforms to string correctly', () => {
      let path = new Path('/path/to/image.png', 'my-source.imgix.net', null, true, null);
      assert.equal(path.toString(), "https://my-source.imgix.net/path/to/image.png");
    });

    it('adds a leading slash', () => {
      let path = new Path('path/to/image.png', 'my-source.imgix.net', null, true, null);
      assert.equal(path.toString(), "https://my-source.imgix.net/path/to/image.png");
    });

    it('creates an insecure string correctly', () => {
      let path = new Path('/path/to/image.png', 'my-source.imgix.net', null, false, null);
      assert.equal(path.toString(), "http://my-source.imgix.net/path/to/image.png");
    });

    it('encodes with a space in path correctly', () => {
      let path = new Path('/users/image 1.png', 'my-social-network.imgix.net', 'FOO123bar', true, null);
      assert.equal(path.toString(), "https://my-social-network.imgix.net/users/image%201.png?s=193462f12470fe53927d0cf21e07d404");
    });

    it('encodes with a token correctly', () => {
      let path = new Path('/users/1.png', 'my-social-network.imgix.net', 'FOO123bar', true, null);
      assert.equal(path.toString(), "https://my-social-network.imgix.net/users/1.png?s=6797c24146142d5b40bde3141fd3600c");
    });

    it('encodes a fully-qualified URL correctly', () => {
      let path = new Path('http://avatars.com/john-smith.png', 'my-social-network.imgix.net', 'FOO123bar', true, null);
      assert.equal(path.toString(), "https://my-social-network.imgix.net/http%3A%2F%2Favatars.com%2Fjohn-smith.png?s=493a52f008c91416351f8b33d4883135");
    });

    it('encodes a fully-qualified URL with spaces in path correctly', () => {
      let path = new Path('http://awebsite.com/users dir/image 1.png', 'my-social-network.imgix.net', 'FOO123bar', true, null);
      assert.equal(path.toString(), "https://my-social-network.imgix.net/http%3A%2F%2Fawebsite.com%2Fusers%20dir%2Fimage%201.png?s=a82cd70cc2b2edae1fd0d83fc86e7884");
    });

    it('encodes a simple path with parameters and a signature', () => {
      let path = new Path('/users/1.png', 'my-social-network.imgix.net', 'FOO123bar', true, null);
      assert.equal(path.toUrl({ w: 400, h: 300 }).toString(), "https://my-social-network.imgix.net/users/1.png?w=400&h=300&s=c7b86f666a832434dd38577e38cf86d1");
    });

    it('encodes a fully-qualified URL with parameters and a signature', () => {
      let path = new Path('http://avatars.com/john-smith.png', 'my-social-network.imgix.net', 'FOO123bar', true, null);
      assert.equal(path.toUrl({ w: 400, h: 300 }).toString(), "https://my-social-network.imgix.net/http%3A%2F%2Favatars.com%2Fjohn-smith.png?w=400&h=300&s=61ea1cc7add87653bb0695fe25f2b534");
    });

    it('URL encodes param keys', () => {
      let path = new Path('demo.png', 'demo.imgix.net', null, true, null);

      assert.equal(path.toUrl({ 'hello world': 'interesting' }).toString(), 'https://demo.imgix.net/demo.png?hello%20world=interesting');
    });

    it('URL encodes param values', () => {
      let path = new Path('demo.png', 'demo.imgix.net', null, true, null);

      assert.equal(path.toUrl({ 'hello_world': '/foo"> <script>alert("hacked")</script><' }).toString(), 'https://demo.imgix.net/demo.png?hello_world=%2Ffoo%22%3E%20%3Cscript%3Ealert%28%22hacked%22%29%3C%2Fscript%3E%3C');
    });

    it('Base64 encodes Base64 param variants', () => {
      let path = new Path('~text', 'demo.imgix.net', null, true, null);

      assert.equal(path.toUrl({ 'txt64': 'I cannøt belîév∑ it wors! 😱' }).toString(), 'https://demo.imgix.net/~text?txt64=SSBjYW5uw7h0IGJlbMOuw6l24oiRIGl0IHdvcu-jv3MhIPCfmLE');
    });
  });
});
