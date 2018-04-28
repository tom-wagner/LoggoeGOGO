import numpy as np
from sklearn import mixture
import scipy.stats

X = np.genfromtxt('data/X.csv')

X = np.array([[x] for x in X])

gmm = mixture.BayesianGaussianMixture(
    n_components=6,
    covariance_type='diag',
    covariance_prior=[0.5],
    max_iter=1000
).fit(X)

print('Means:', gmm.means_)
print('covariances:', gmm.covariances_)
print('weights:', gmm.weights_)

triplets = [(m, c, w) for m, c, w in zip(gmm.means_, gmm.covariances_, gmm.weights_) if w > 0.05]
triplets.sort(key=lambda x: x[0])
means, covariances, weights = zip(*triplets)

print('Means:', means)
print('covariances:', covariances)
print('weights:', weights)

clusters = np.array(
    [[w * scipy.stats.norm.pdf(x_i, loc=m[0], scale=c[0]**0.5) for m, c, w in zip(means, covariances, weights)]
        for x_i in X])

clusters = np.array([[r / sum(row) for r in row] for row in clusters])

np.savetxt('test/weights.csv', weights)
np.savetxt('test/mu.csv', means)
np.savetxt('test/sd.csv', [x**0.5 for x in covariances])
np.savetxt('test/clusters.csv', clusters, delimiter=',')
np.savetxt('test/hard_clusters.csv', [max([i for i in range(len(row))],
                                          key=lambda i: row[i]) for row in clusters], delimiter=',')
