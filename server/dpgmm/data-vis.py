import numpy as np
import matplotlib.pyplot as plt
import matplotlib.mlab as mlab

X = np.genfromtxt('data/X.csv')
true_clusters = np.genfromtxt('data/clusters.csv')
true_weights = np.genfromtxt('data/weights.csv')
true_mu = np.genfromtxt('data/mu.csv')
true_sd = np.genfromtxt('data/sd.csv')

test_weights = np.genfromtxt('test/weights.csv')
test_mu = np.genfromtxt('test/mu.csv')
test_sd = np.genfromtxt('test/sd.csv')
test_clusters = np.genfromtxt('test/clusters.csv', delimiter=',')

x = np.linspace(0, 10, 500)
for mu, sigma, w in zip(true_mu, true_sd, true_weights):
    plt.plot(x, [w * y for y in mlab.normpdf(x, mu, sigma)], c='gray')
for mu, sigma, w in zip(test_mu, test_sd, test_weights):
    plt.plot(x, [w * y for y in mlab.normpdf(x, mu, sigma)])

plt.scatter(X, [1 for _ in X], alpha=0.5, c=[max([i for i in range(len(weights))], key=lambda i: weights[i])
                                             for weights in test_clusters])

plt.show()
