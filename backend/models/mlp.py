try:
    import torch
    import torch.nn as nn

    class FireMLP(nn.Module):
        """
        Exact PyTorch Neural Network architecture defined in Cell 28 of the ML Notebook:
        Input Layer -> Linear(128) + BatchNorm1d + ReLU + Dropout(0.3)
                    -> Linear(64) + BatchNorm1d + ReLU + Dropout(0.3)
                    -> Linear(32) + BatchNorm1d + ReLU + Dropout(0.3)
                    -> Linear(2) classes
        """
        def __init__(self, in_dim: int = 18, hidden=(128, 64, 32), n_classes: int = 2, dropout: float = 0.3):
            super().__init__()
            layers = []
            prev = in_dim
            for h in hidden:
                layers += [nn.Linear(prev, h), nn.BatchNorm1d(h), nn.ReLU(), nn.Dropout(dropout)]
                prev = h
            layers += [nn.Linear(prev, n_classes)]
            self.net = nn.Sequential(*layers)

        def forward(self, x):
            return self.net(x)

except ImportError:
    # Safe fallback if torch is not yet installed in local python environment
    class FireMLP:
        def __init__(self, *args, **kwargs):
            pass
