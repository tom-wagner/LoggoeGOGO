import numpy as np
from sklearn import mixture
import scipy.stats
import sys

if len(sys.argv) < 2 or len(sys.argv[1].split(',')) < 10:
    print(sys.argv[1])
    print('NOT ENOUGH DATA')
else:
    X = sys.argv[1].split(',')

    X = np.array([[float(x)] for x in X])

    gmm = mixture.BayesianGaussianMixture(
        n_components=6,
        covariance_type='diag',
        covariance_prior=[0.5],
        max_iter=1000
    ).fit(X)

    triplets = [(m, c, w) for m, c, w in zip(gmm.means_, gmm.covariances_, gmm.weights_) if w > 0.05]
    triplets.sort(key=lambda x: x[0])
    means, covariances, weights = zip(*triplets)

    clusters = np.array(
        [[w * scipy.stats.norm.pdf(x_i, loc=m[0], scale=c[0]**0.5) for m, c, w in zip(means, covariances, weights)]
            for x_i in X])
    clusters = np.array([[r / sum(row) for r in row] for row in clusters])

    hard_clusters = [max([i for i in range(len(row))], key=lambda i: row[i]) for row in clusters]

    means = [x[0] for x in means]
    covariances = [x[0] for x in covariances]
    sds = [x**0.5 for x in covariances]

    print([means, sds, list(weights), [r[0] for r in X], hard_clusters])
    # sys.stdout.flush()
