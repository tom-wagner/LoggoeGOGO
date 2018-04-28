import numpy as np
import matplotlib.pyplot as plt

# number of examples
N = 100

# number of clusters
k = np.random.randint(2, 8)
print('Num clusters:', k)

# generate cluster distribution
P = np.random.dirichlet(tuple(1 for _ in range(k)), 1)[0]
print('Cluster distribution:', P)

# assign a cluster to each example
C = np.random.choice(k, N, replace=True, p=P)

# generate cluster means and variances
mu = np.random.uniform(0, 10, size=k)
sd = np.random.uniform(0.1, 0.3, size=k)

print('cluster means:', mu)
print('cluster standard deviations:', sd)

X = np.array([np.random.normal(loc=mu[c], scale=sd[c]) for c in C])

if False:
    plt.scatter(X, [1 for _ in X], alpha=0.05, c=C)
    plt.show()

# add noise
X = np.append(X, np.random.uniform(0, 10, 50))
C = np.append(C, [0 for _ in range(50)])

np.savetxt('data/X.csv', X)
np.savetxt('data/clusters.csv', C)
np.savetxt('data/weights.csv', P)
np.savetxt('data/mu.csv', mu)
np.savetxt('data/sd.csv', sd)
