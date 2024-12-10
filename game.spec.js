
jasmine.getEnv().configure({ random: false });
jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000; // 10 seconds

describe("Game", function() {
    let game;
  
    beforeEach(function() {
      game = new Game();
    });
  
    it("should initialize with default choices", function() {
      expect(game.choices).toEqual(['rock', 'paper', 'scissors']);
    });
  
    it("should initialize with empty images", function() {
      expect(game.images.rock).toBe('default-rock.jpg');
      expect(game.images.paper).toBe('default-paper.jpg');
      expect(game.images.scissors).toBe('default-scissors.jpg');
    });
  
    it("should update images", function() {
      game.images.rock = 'rock.jpg';
      game.images.paper = 'paper.jpg';
      game.images.scissors = 'scissors.jpg';
      game.updateImages();
      expect(document.getElementById('rock').src).toContain('rock.jpg');
      expect(document.getElementById('paper').src).toContain('paper.jpg');
      expect(document.getElementById('scissors').src).toContain('scissors.jpg');
    });
  
    it("should determine the correct result", function() {
      spyOn(game, 'displayResult');
      spyOn(game, 'updateLocalStorage');
      spyOn(game, 'updateHistory');
      spyOn(game, 'updateStats');
  
      game.play('rock');
      expect(['win', 'lose', 'tie']).toContain(game.displayResult.calls.mostRecent().args[2]);
  
      game.play('paper');
      expect(['win', 'lose', 'tie']).toContain(game.displayResult.calls.mostRecent().args[2]);
  
      game.play('scissors');
      expect(['win', 'lose', 'tie']).toContain(game.displayResult.calls.mostRecent().args[2]);
    });
  
    it("should update local storage", function() {
      spyOn(localStorage, 'setItem');
      game.updateLocalStorage('rock', 'scissors', 'win');
      expect(localStorage.setItem).toHaveBeenCalledWith('gameHistory', jasmine.any(String));
    });
  
    it("should reset history", function() {
      spyOn(localStorage, 'removeItem');
      game.resetHistory();
      expect(localStorage.removeItem).toHaveBeenCalledWith('gameHistory');
    });
  
    it("should load images from API", async function(done) {
      const mockResponse = (url) => {
        if (url.includes('rock')) {
          return Promise.resolve({
            json: () => Promise.resolve({ urls: { small: 'rock.jpg' } })
          });
        } else if (url.includes('paper')) {
          return Promise.resolve({
            json: () => Promise.resolve({ urls: { small: 'paper.jpg' } })
          });
        } else if (url.includes('scissors')) {
          return Promise.resolve({
            json: () => Promise.resolve({ urls: { small: 'scissors.jpg' } })
          });
        }
      };
  
      spyOn(window, 'fetch').and.callFake(mockResponse);
  
      await game.loadImages();
  
      expect(game.images.rock).toBe('rock.jpg');
      expect(game.images.paper).toBe('paper.jpg');
      expect(game.images.scissors).toBe('scissors.jpg');
      done();
    });
  });